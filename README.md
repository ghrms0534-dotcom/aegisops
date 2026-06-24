# AegisOps

AegisOps is an AI-powered DevOps operations platform that helps operators monitor, analyze, and manage Kubernetes, Docker, Git, GitHub, and infrastructure workflows through an agent-based web dashboard.

## 프로젝트 개요

AegisOps는 FastAPI 백엔드와 React/Vite 프론트엔드로 구성된 DevOps / InfraOps 운영 대시보드입니다.
운영자는 웹 UI에서 Dashboard, AI Assistant, Cluster, Container, Cloud Resources, Source Control, Delivery Pipeline, Observability, Security, AI Runtime, Configuration 영역을 확인할 수 있습니다.

현재 프로젝트는 안전한 Demo Mode를 기본값으로 사용합니다. 실제 인프라 변경 명령은 실행하지 않고, 로컬 read-only 조회와 demo/simulation 데이터를 조합해 운영 플랫폼 형태를 제공합니다.

현재 데이터 소스는 다음처럼 구분됩니다.

- **로컬 read-only 조회:** `kubectl`, `docker`, `git`, Windows system metrics
- **SQLite 개발 데이터:** users, clusters, namespaces, pods, containers, deployments, alerts, audit logs 등
- **Demo Provider:** AWS, NCP, Prometheus, Jenkins, ArgoCD, Grafana, GitHub Actions
- **GitHub Connector:** `GITHUB_TOKEN` 설정 시 GitHub repository 상태 read-only 조회
- **AI Assistant:** Ollama `/api/generate` 연동, Dashboard context와 대화 history 기반 분석
- **Safe Action Simulation:** 실제 명령 없이 `executed: false` demo 응답만 반환

## 주요 목표

- DevOps 운영 상태를 한 화면에서 확인
- Kubernetes Cluster / Namespace / Pod 상태 조회
- Docker Container 상태 조회
- Git / GitHub / Source Control 상태 확인
- Deployment / Pipeline / Automation 실행 흐름 확인
- Metrics / Logs / Alerts / Events / Audit Logs 확인
- JWT 기반 로그인 / 회원가입 / 사용자 인증
- WebSocket 기반 Dashboard Event 및 Log Stream 제공
- AI Assistant를 통한 InfraOps 질의와 원인 분석 지원
- Demo Mode 기반 안전한 운영 작업 simulation 제공
- Provider / Service 계층을 통한 향후 운영 환경 확장 구조 유지

## 기술 스택

### Backend

- Python 3.10+
- FastAPI / Uvicorn
- SQLAlchemy / SQLite
- Pydantic / pydantic-settings
- python-jose / passlib / bcrypt
- WebSocket
- Python standard library 기반 local runtime 조회
- Ollama HTTP API 연동

### Frontend

- React 18
- TypeScript
- Vite
- Axios
- Tailwind CSS
- lucide-react
- clsx / tailwind-merge

## 주요 기능

### 인증 / 사용자

- Email + Password 로그인
- 회원가입
- JWT Access Token 발급
- Bearer Token 기반 현재 사용자 조회
- 새로고침 시 token 검증 후 로그인 유지
- Logout 시 token 삭제
- 로그인 화면의 `데모 체험하기`는 frontend Demo Mode로 `demo-token`을 저장하고 Dashboard로 진입

로그인은 OAuth2 Form 형식을 사용하며, 화면의 email 값은 backend form field의 `username`으로 전송됩니다.

### Dashboard

- Active Pods, Running Containers, Deployment Success, CPU, Memory, Disk, Git 상태 요약
- GitHub / Prometheus / Jenkins / Cloud demo 상태 카드
- Runtime Sources와 System Health 표시
- CPU / Memory / Disk / Network trend chart
- WebSocket 기반 Recent Events 갱신
- Alert Center, Live Logs, AI Analysis Summary 표시
- 카드 클릭 시 관련 상세 메뉴로 이동
- 운영 작업 버튼은 실제 명령이 아닌 Demo simulation만 수행

### AI Assistant

- 채팅형 InfraOps 분석 UI
- Dashboard context와 최근 대화 history를 backend로 전달
- Ollama 모델을 통한 운영 분석 응답 생성
- 답변은 위험도, 가능한 원인, 권장 조치, 다음 확인 항목 중심으로 구성
- Ollama 연결 실패 시 사용자에게 연결 실패 메시지 표시
- 실제 Kubernetes / Docker / GitHub 조작은 수행하지 않음

### Infrastructure

- Cluster 페이지: Cluster / Namespace / Node / Pod 상태 확인
- Pod 선택 시 상세 정보, 로그, 이벤트, 메트릭 확인
- Container 페이지: Container 목록, 상태, 이미지, 포트, 상세 로그 확인
- Cloud Resources 페이지: AWS / NCP Demo Provider 카드와 compact architecture view 표시
- Network 페이지: 서비스 연결 상태, 포트 상태, API 응답 상태, 네트워크 이벤트 표시
- Storage 페이지: Disk, Kubernetes PVC, Docker Volume, Backup 상태 표시

### Source Control

- 저장소 목록과 Sync 상태 확인
- Branch ahead/behind, 보호 여부, 위험도 확인
- Pull Request 상태, Reviewer, Checks 확인
- Release 버전, Tag, 환경, Deploy 상태 확인
- 실제 Git push/pull/merge/rebase/reset 명령은 실행하지 않음

### Delivery / Workflows / Automation

- Deployment history 조회
- 새 배포는 Demo simulation으로만 처리
- Pipeline 진행 단계와 최근 Workflow 실행 상태 표시
- Automation Runbook 목록, Trigger, 대상, 결과, 위험도 확인
- 선택 필터가 실제 카드/테이블 목록에 반영됨
- Jenkins / GitHub Actions / ArgoCD Provider 상태 표시

### Observability

- Metrics 수집 상태와 Prometheus demo metrics 표시
- Logs Explorer에서 WebSocket 로그 stream 확인
- 로그 검색, severity, service 필터 적용
- Alerts 목록, 읽음 처리, AI 원인 분석 패널 표시
- Alert 권장 조치는 Demo simulation만 수행
- Events Timeline에서 상태별 운영 이벤트 필터링

### Security

- Security Monitoring 이벤트 확인
- 상태 / 출처 필터 적용
- Access Control에서 사용자, 역할, 권한 정책 확인
- Audit Logs에서 사용자 작업, 대상, 상태, 위험도 확인

### AI Runtime

- Runtime Agent 상태 확인
- Agent 상태 필터링
- Agent 작업 실행은 Demo simulation으로만 처리
- Execution History와 Agent Workflow는 기존 Events / Workflows 화면을 재사용

### Configuration

- Settings에서 Environment, Log Level 선택
- 설정 저장은 Demo simulation으로만 처리
- Integrations에서 Cloud / Observability / Delivery Provider 상태 필터링

### Connectors

- GitHub: `GITHUB_TOKEN` 설정 시 `/api/github/status`, `/api/github/repos` read-only 조회
- Prometheus: `/api/prometheus/metrics` demo metrics
- Jenkins: `/api/jenkins/status`, `/jobs`, `/builds`, `/pipelines` demo CI/CD 상태
- AWS/NCP: 외부 API 호출 없는 Demo Cloud Provider

### Log Stream

- `/ws/logs` WebSocket endpoint 사용
- Demo 운영 로그를 주기적으로 전송
- frontend Log Stream 화면에서 실시간 표시

## 데이터 출처

| 영역 | 데이터 출처 | 현재 동작 |
|---|---|---|
| Dashboard Summary | Local Runtime Provider | Kubernetes, Docker, Git, System 상태 통합 |
| Kubernetes 화면 | SQLite Seed + local live endpoint | Cluster, Namespace, Pod 조회 |
| Docker 화면 | SQLite Seed + local live endpoint | Container 목록과 상세 상태 표시 |
| Source Control | Demo data + local Git endpoint | 저장소/Branch/PR/Release 화면 표시 |
| Live Git API | Local Git repository | Branch, modified files, remote 조회 |
| Deployments | SQLite + Demo simulation | 이력 조회와 Demo trigger 표시 |
| Monitoring | Demo metrics | CPU, Memory, Disk, Prometheus metrics 표시 |
| Cloud Resources | Demo Provider | AWS/NCP 리소스 카드 표시 |
| Integrations | Integration Provider | Provider 연결 준비/상태 표시 |
| AI Assistant | Ollama + dashboard context | InfraOps 질문 분석 |
| Log Stream | WebSocket demo stream | 운영 로그 예시 전송 |

로컬 Runtime 조회가 실패하면 가짜 정상값으로 조용히 대체하지 않고, 해당 Provider의 오류 상태를 표시합니다.

## API 구조

현재 FastAPI Router 기준입니다.

| 영역 | Prefix | 주요 기능 |
|---|---|---|
| Auth | `/api/auth` | `POST /login`, `POST /register`, `GET /me` |
| AI | `/api/ai` | `POST /analyze` |
| Kubernetes | `/api/k8s` | clusters, namespaces, pods, pod restart |
| Docker | `/api/docker` | containers, container status |
| Deployments | `/api/deployments` | history, trigger |
| Git | `/api/git` | repositories |
| Monitoring | `/api/monitoring` | metrics |
| Alerts | `/api/alerts` | alerts, read |
| Admin | `/api/admin` | users, audit logs |
| Runtime | `/api/runtime` | health |
| Dashboard | `/api/dashboard` | summary, overview |
| Live Kubernetes | `/api/k8s/live` | pods |
| Live Docker | `/api/docker/live` | containers |
| Live Git | `/api/git/live` | status |
| Actions | `/api/actions` | safe action simulation |
| Integrations | `/api/integrations` | status |
| Cloud | `/api/cloud` | aws, ncp |
| GitHub | `/api/github` | status, repos |
| Prometheus | `/api/prometheus` | demo metrics |
| Jenkins | `/api/jenkins` | demo status, jobs, builds, pipelines |
| WebSocket | `/ws/logs` | realtime logs |
| WebSocket | `/ws/dashboard` | dashboard events |

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

## Provider / Service 구조

로컬 명령 실행과 외부 Provider 상태 조회는 Router나 React Component에 직접 넣지 않고 service/provider 계층으로 분리되어 있습니다.

```text
API Router
└─ Dashboard Service
   ├─ Local Kubernetes Provider
   ├─ Local Docker Provider
   ├─ Local Git Provider
   └─ Local System Provider
```

- Router는 HTTP 요청과 응답만 담당합니다.
- Service는 여러 Provider 결과를 조합합니다.
- Provider는 runtime 조회, timeout, error handling을 담당합니다.
- local provider는 read-only 명령만 사용합니다.
- AWS/NCP Provider는 고정 Demo data만 반환합니다.
- Prometheus/Jenkins Connector는 실제 서버 연결 없이 demo 응답을 반환합니다.

## 프로젝트 구조

```text
AegisOps/
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ actions.py
│  │  │  ├─ admin.py
│  │  │  ├─ ai.py
│  │  │  ├─ alerts.py
│  │  │  ├─ auth.py
│  │  │  ├─ cloud.py
│  │  │  ├─ deployments.py
│  │  │  ├─ docker.py
│  │  │  ├─ git.py
│  │  │  ├─ github.py
│  │  │  ├─ integrations.py
│  │  │  ├─ jenkins.py
│  │  │  ├─ k8s.py
│  │  │  ├─ monitoring.py
│  │  │  ├─ prometheus.py
│  │  │  └─ runtime.py
│  │  ├─ connectors/
│  │  ├─ core/
│  │  ├─ db/
│  │  ├─ models/
│  │  ├─ providers/
│  │  │  └─ integrations/
│  │  ├─ schemas/
│  │  ├─ services/
│  │  ├─ websocket/
│  │  └─ main.py
│  ├─ .env.example
│  ├─ aegisops.db
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  ├─ components/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ types/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ vite.config.ts
├─ ARCHITECTURE.txt
└─ README.md
```

## 설치 및 실행

필수 환경:

- Python 3.10+
- Node.js / npm

선택 환경:

- Docker Desktop
- `kubectl`
- Git CLI
- Ollama server

선택 도구가 없거나 실행 실패하면 관련 카드에 연결 실패 또는 제한 상태가 표시됩니다.

### Backend 환경 변수

`backend/.env.example`을 참고해 `backend/.env`를 생성합니다.

```env
GITHUB_TOKEN=
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
DEMO_MODE=true
ALLOW_REAL_COMMANDS=false
```

GPU 서버 Ollama를 쓰는 경우 `.env`의 `OLLAMA_BASE_URL`, `OLLAMA_MODEL`만 변경합니다.
토큰이나 서버 주소는 코드에 하드코딩하지 않습니다.

### Backend 최초 설치

```powershell
cd C:\Workspace\AegisOps\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Backend 실행

```powershell
cd C:\Workspace\AegisOps\backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Backend: [http://localhost:8000](http://localhost:8000)
- Swagger: [http://localhost:8000/docs](http://localhost:8000/docs)

최초 설치 후 다시 실행할 때는 가상환경 활성화와 uvicorn 실행만 하면 됩니다.

### Frontend 최초 설치

```powershell
cd C:\Workspace\AegisOps\frontend
npm install
```

### Frontend 실행

```powershell
cd C:\Workspace\AegisOps\frontend
npm run dev
```

- Frontend: [http://localhost:3100](http://localhost:3100)
- Vite proxy는 `/api`와 `/ws` 요청을 `127.0.0.1:8000`으로 전달합니다.

최초 설치 후 다시 실행할 때는 `npm run dev`만 실행하면 됩니다.

## 데모 계정

초기 DB에 사용자가 없으면 seed 단계에서 기본 계정이 생성됩니다.

| 권한 | 이메일 | 비밀번호 |
|---|---|---|
| 관리자 | `admin@aegisops.local` | `admin123` |
| 운영 담당자 | `dev@aegisops.local` | `dev123` |
| 조회 전용 | `viewer@aegisops.local` | `view123` |

로그인은 사용자 이름이 아니라 **이메일**을 사용합니다.
로그인 화면의 `데모 체험하기`는 backend 인증 없이 frontend Demo Mode로 진입합니다.

## 개발 DB

- SQLite 파일: `backend/aegisops.db`
- 서버 시작 시 테이블 생성, 간단 schema 보정, seed가 실행됩니다.
- 기존 사용자가 있으면 기본 계정을 중복 생성하지 않습니다.

개발 DB를 초기화해야 할 때만 backend를 종료한 뒤 DB 파일을 삭제합니다.
저장된 사용자와 demo 데이터가 모두 삭제됩니다.

```powershell
cd C:\Workspace\AegisOps\backend
Remove-Item .\aegisops.db
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 검증

### Backend Import

```powershell
cd C:\Workspace\AegisOps\backend
.\.venv\Scripts\python.exe -c "from app.main import app; print(app.title)"
```

정상 출력은 `AegisOps API`입니다.

### Runtime API

Backend 실행 후 확인합니다.

```powershell
Invoke-RestMethod http://localhost:8000/api/runtime/health
Invoke-RestMethod http://localhost:8000/api/dashboard/summary
Invoke-RestMethod http://localhost:8000/api/dashboard/overview
Invoke-RestMethod http://localhost:8000/api/k8s/live/pods
Invoke-RestMethod http://localhost:8000/api/docker/live/containers
Invoke-RestMethod http://localhost:8000/api/git/live/status
Invoke-RestMethod http://localhost:8000/api/cloud/aws
Invoke-RestMethod http://localhost:8000/api/cloud/ncp
Invoke-RestMethod http://localhost:8000/api/prometheus/metrics
Invoke-RestMethod http://localhost:8000/api/jenkins/status
```

Safe Action API:

```powershell
Invoke-RestMethod `
  -Method Post `
  -ContentType "application/json" `
  -Uri http://localhost:8000/api/actions/simulate `
  -Body '{"actionType":"Restart Pod","targetType":"pod","targetName":"api-gateway","namespace":"default"}'
```

AI analyze API:

```powershell
Invoke-RestMethod `
  -Method Post `
  -ContentType "application/json" `
  -Uri http://localhost:8000/api/ai/analyze `
  -Body '{"message":"payment-api Pod 재시작 원인을 분석해줘","context":{"cpu_usage":"82%","memory_usage":"67%"}}'
```

### Frontend Build

```powershell
cd C:\Workspace\AegisOps\frontend
npm run build
```

## Demo Safety Mode

기본 실행은 안전한 Demo Mode입니다.

```env
DEMO_MODE=true
ALLOW_REAL_COMMANDS=false
```

- `POST /api/actions/simulate`는 실제 명령을 실행하지 않고 simulation 결과만 반환합니다.
- 응답에는 `executed: false`가 포함됩니다.
- `kubectl delete/apply/scale/rollout`, `docker restart/stop/rm`, `git push/pull/merge/rebase/reset`, Jenkins build trigger 같은 변경성 명령은 구현되어 있지 않습니다.
- UI의 배포, 자동화, Agent 실행, 권장 조치, 설정 저장은 Demo simulation입니다.
- 실제 인프라 변경 기능이 필요하면 별도 권한, 감사 로그, 승인 흐름을 먼저 설계해야 합니다.

## 현재 제한사항

- Kubernetes와 Docker 상세 화면은 SQLite demo 데이터와 local read-only endpoint를 함께 사용합니다.
- Source Control의 저장소/Branch/PR/Release 화면은 demo 데이터를 사용합니다.
- Deployment Trigger는 실제 Pipeline을 실행하지 않습니다.
- Prometheus와 Jenkins는 실제 서버 연결이 아닌 demo connector입니다.
- AWS/NCP Cloud Resources는 실제 Cloud 계정, credential, SDK, 외부 API를 사용하지 않습니다.
- GitHub는 `GITHUB_TOKEN`이 있을 때만 read-only API 조회를 수행합니다.
- Dashboard WebSocket과 Log WebSocket은 demo 이벤트와 로그 예시를 전송합니다.
- Demo login은 실제 backend 인증 계정이 아니라 frontend Demo Mode입니다.
- Agent Runtime과 Workflow는 운영 상태 표현 UI이며 실제 자동 실행 엔진은 연결되어 있지 않습니다.
- AI Assistant는 Ollama 연결이 필요하며, 모델 응답 품질은 설정된 local/GPU Ollama 모델에 따라 달라집니다.

실제 운영 명령 실행이나 외부 Cloud 리소스 변경 기능은 현재 범위에 포함되어 있지 않습니다.
