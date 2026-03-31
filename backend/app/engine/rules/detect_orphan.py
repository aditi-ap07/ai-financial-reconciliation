from ...constants.gap_types import GAP_TYPES

class DetectOrphan:
    def evaluate(self, transaction, settlements, config):
        # Orphan rule handled in reconciler by settlement-only records
        return None
