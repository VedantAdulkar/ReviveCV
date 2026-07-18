import os
import yaml
import json
from pydantic import BaseModel
from typing import Dict, Any, Tuple

PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "../../../prompts")

class PromptBuilder:
    @staticmethod
    def _parse_template(template_name: str) -> Tuple[Dict[str, Any], str]:
        file_path = os.path.join(PROMPTS_DIR, f"{template_name}.md")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Prompt template {template_name}.md not found.")
            
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if not content.startswith("---"):
            raise ValueError("Prompt template missing YAML frontmatter.")
            
        _, frontmatter, body = content.split("---", 2)
        metadata = yaml.safe_load(frontmatter)
        
        return metadata, body.strip()

    @staticmethod
    def build_prompt(template_name: str, variables: Dict[str, Any]) -> Tuple[str, Dict[str, Any]]:
        """
        Injects variables into the static template.
        Returns the compiled prompt string and the prompt metadata (version, model, etc.)
        """
        metadata, template_body = PromptBuilder._parse_template(template_name)
        
        compiled_prompt = template_body
        for key, value in variables.items():
            if isinstance(value, BaseModel):
                value_str = value.model_dump_json(indent=2)
            elif isinstance(value, dict) or isinstance(value, list):
                value_str = json.dumps(value, indent=2)
            else:
                value_str = str(value)
                
            compiled_prompt = compiled_prompt.replace(f"{{{{ {key} }}}}", value_str)
            
        return compiled_prompt, metadata
