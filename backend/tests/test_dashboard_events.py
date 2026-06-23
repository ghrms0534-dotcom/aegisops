import unittest

from app.websocket.dashboard_events import DashboardEventManager, EVENTS, dashboard_event


class FakeWebSocket:
    def __init__(self):
        self.accepted = False
        self.messages = []

    async def accept(self):
        self.accepted = True

    async def send_json(self, message):
        self.messages.append(message)


class DashboardEventTest(unittest.TestCase):
    def test_event_format_and_cycle(self):
        event = dashboard_event(len(EVENTS))
        self.assertEqual(event["type"], "dashboard_status_changed")
        self.assertEqual(event["service"], EVENTS[0]["service"])
        self.assertIn("timestamp", event)
        self.assertIsInstance(event["data"], dict)


class DashboardManagerTest(unittest.IsolatedAsyncioTestCase):
    async def test_broadcasts_to_multiple_clients(self):
        manager = DashboardEventManager()
        first, second = FakeWebSocket(), FakeWebSocket()
        await manager.connect(first)
        await manager.connect(second)
        await manager.broadcast({"type": "heartbeat"})
        self.assertEqual(first.messages, [{"type": "heartbeat"}])
        self.assertEqual(second.messages, [{"type": "heartbeat"}])
        manager.disconnect(first)
        manager.disconnect(second)


if __name__ == "__main__":
    unittest.main()
