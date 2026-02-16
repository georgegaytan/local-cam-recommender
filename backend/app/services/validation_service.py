import hashlib
import json

from app.models.configuration import Configuration, ValidationResult


class ValidationService:
    def validate(self, config: Configuration) -> ValidationResult:
        warnings = []
        is_valid = True

        # Simple deterministic rule
        # Rule: Feed rate must be < Spindle Speed * 0.1 (arbitrary constant)
        if config.feed_rate >= config.spindle_speed * 0.1:
            warnings.append(f"Feed rate {config.feed_rate} is too high for spindle speed {config.spindle_speed}")
            # In a real system, this might be an error or just a warning depending on severity

        # Rule: Tool diameter must be positive
        if config.tool_diameter <= 0:
            is_valid = False
            warnings.append("Tool diameter must be positive")

        # Config hash for immutable audit trail
        config_dict = {
            "machine_id": config.machine_id,
            "material": config.material,
            "tool_diameter": config.tool_diameter,
            "feed_rate": config.feed_rate,
            "spindle_speed": config.spindle_speed,
        }
        config_str = json.dumps(config_dict, sort_keys=True)
        validation_hash = hashlib.sha256(config_str.encode()).hexdigest()

        return ValidationResult(
            config_id=config.id,
            is_valid=is_valid,
            warnings=warnings,
            validation_hash=validation_hash,
        )
