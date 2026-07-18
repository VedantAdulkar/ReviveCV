import json
import logging
from typing import Type, TypeVar, Optional, Any
from pydantic import BaseModel, ValidationError
from backend.services.prompt_builder.builder import PromptBuilder
from backend.services.ai.client import AIClient
from backend.services.ai.providers.ollama import OllamaProvider

T = TypeVar('T', bound=BaseModel)

# Set up basic session-aware logger
logger = logging.getLogger("ai_pipeline")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - [%(session_id)s] - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

class AIPipeline:
    def __init__(self, client: AIClient = OllamaProvider()):
        self.client = client

    def _extract_json(self, raw_text: str) -> str:
        """Naive JSON extraction in case the model wraps it in markdown blocks."""
        text = raw_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def run(self, template_name: str, variables: dict, schema_class: Type[T], session_id: str) -> Optional[T]:
        extra = {"session_id": session_id}
        
        logger.info(f"Building prompt for '{template_name}'", extra=extra)
        try:
            compiled_prompt, metadata = PromptBuilder.build_prompt(template_name, variables)
            model = metadata.get("model", "qwen3:8b")
        except Exception as e:
            logger.error(f"Failed to build prompt: {e}", extra=extra)
            raise

        logger.info(f"Prompt sent to {model}", extra=extra)
        
        # Implement retry logic (1 retry attempt)
        for attempt in range(2):
            try:
                raw_response = self.client.generate(compiled_prompt, model)
                logger.info(f"Response received on attempt {attempt + 1}", extra=extra)
                
                json_str = self._extract_json(raw_response)
                parsed_json = json.loads(json_str)
                
                # Validation
                validated_obj = schema_class(**parsed_json)
                logger.info("Validation passed", extra=extra)
                
                # Append metadata to the validated object if it accepts it
                if hasattr(validated_obj, 'prompt_version'):
                    validated_obj.prompt_version = str(metadata.get('version', 'unknown'))
                    validated_obj.model = model
                
                return validated_obj
                
            except (json.JSONDecodeError, ValidationError) as e:
                logger.warning(f"Validation failed on attempt {attempt + 1}: {e}", extra=extra)
                if attempt == 1:
                    logger.error("Max retries exceeded for AI Pipeline.", extra=extra)
                    raise
            except Exception as e:
                logger.error(f"AI Client error: {e}", extra=extra)
                raise
        
        return None
