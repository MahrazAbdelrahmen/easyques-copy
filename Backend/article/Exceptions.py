
class DataQueryInputIsNotList(Exception):
    """
    Exception raised when the input for data query is not a list.

    This exception is raised when a function or method expects the input to be a list but receives a different type.

    Example:
    ```python
    def process_data(data_list):
        if not isinstance(data_list, list):
            raise DataQueryInputIsNotList("Input must be a list.")
    ```

    Attributes:
    - `message` (str): A description of the exception.
    """

    def __init__(self, message="Input must be a list."):
        super().__init__(message)
