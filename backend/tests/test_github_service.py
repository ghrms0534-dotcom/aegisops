import unittest
from unittest.mock import patch

from app.services import github_service


class GitHubServiceTest(unittest.TestCase):
    @patch.object(github_service.settings, "GITHUB_TOKEN", "")
    def test_missing_token_skips_network(self):
        with patch.object(github_service, "_get") as request:
            self.assertFalse(github_service.validate_github_token())
            self.assertEqual(github_service.get_github_repository_count(), 0)
            request.assert_not_called()

    @patch.object(github_service.settings, "GITHUB_TOKEN", "token")
    def test_repository_pages_are_counted(self):
        with patch.object(github_service, "_get", side_effect=[[{}] * 100, [{}, {}]]) as request:
            self.assertEqual(github_service.get_github_repository_count(), 102)
            self.assertEqual(request.call_count, 2)


if __name__ == "__main__":
    unittest.main()
