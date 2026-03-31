from abc import ABC, abstractmethod

class BaseRule(ABC):
    @abstractmethod
    def evaluate(self, transaction, settlements, config):
        pass
