# AegisOps

FastAPI 백엔드와 React/Vite 프론트엔드로 구성된 DevOps 관리 프로젝트입니다.

## 실행

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 3300
```

- Backend port: `3300`
- Swagger: http://localhost:3300/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend port: `3100`
- 빌드 확인: `npm run build`

Vite 개발 서버는 `/api`와 `/ws` 요청을 `localhost:3300`으로 전달합니다.

개발 DB를 완전히 초기화해야 할 때만 Backend를 종료한 뒤 `backend/aegisops.db`를 삭제하고 다시 실행하세요. 일반적인 schema 변경은 시작 시 자동 반영됩니다.
