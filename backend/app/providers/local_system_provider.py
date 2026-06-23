import ctypes
import shutil
import time

from app.providers.base import PROJECT_ROOT, ProviderResult, failure, success


class _FileTime(ctypes.Structure):
    _fields_ = [("low", ctypes.c_uint32), ("high", ctypes.c_uint32)]


class _MemoryStatus(ctypes.Structure):
    _fields_ = [
        ("length", ctypes.c_uint32), ("memory_load", ctypes.c_uint32),
        ("total_physical", ctypes.c_uint64), ("available_physical", ctypes.c_uint64),
        ("total_page_file", ctypes.c_uint64), ("available_page_file", ctypes.c_uint64),
        ("total_virtual", ctypes.c_uint64), ("available_virtual", ctypes.c_uint64),
        ("available_extended_virtual", ctypes.c_uint64),
    ]


def _file_time(value: _FileTime) -> int:
    return (value.high << 32) + value.low


class LocalSystemProvider:
    source = "local"

    def metrics(self) -> ProviderResult:
        try:
            first = [_FileTime(), _FileTime(), _FileTime()]
            second = [_FileTime(), _FileTime(), _FileTime()]
            ctypes.windll.kernel32.GetSystemTimes(*(ctypes.byref(value) for value in first))
            time.sleep(0.1)
            ctypes.windll.kernel32.GetSystemTimes(*(ctypes.byref(value) for value in second))
            idle = _file_time(second[0]) - _file_time(first[0])
            total = (_file_time(second[1]) - _file_time(first[1])) + (_file_time(second[2]) - _file_time(first[2]))
            memory = _MemoryStatus()
            memory.length = ctypes.sizeof(_MemoryStatus)
            if not ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(memory)):
                raise OSError("Memory 상태를 읽을 수 없습니다.")
            disk = shutil.disk_usage(PROJECT_ROOT.anchor)
            return success(
                self.source, cpu_percent=round((1 - idle / total) * 100, 1) if total else 0,
                memory_percent=float(memory.memory_load), disk_percent=round((disk.used / disk.total) * 100, 1),
            )
        except (AttributeError, OSError, ZeroDivisionError) as exc:
            return failure(self.source, str(exc), cpu_percent=0, memory_percent=0, disk_percent=0)
