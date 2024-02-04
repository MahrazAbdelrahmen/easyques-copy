class FileDoesNotExist(Exception):
    """
    Custom exception to indicate that a file or directory does not exist.

    This exception can be raised when attempting to access a file or directory
    that is expected to exist, but is not found.

    Example:
    ```python
    try:
        read_file('nonexistent_file.txt')
    except FileDoesNotExist as e:
        print(f"Error: {e}")
    ```

    Attributes:
        message (str): A custom error message describing the non-existent file or directory.
    """

    def __init__(self, message="The specified file or directory does not exist."):
        self.message = message
        super().__init__(self.message)
