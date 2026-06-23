# AegisOps

AegisOps is an AI-powered DevOps operations platform that helps operators monitor, analyze, and manage Kubernetes, Docker, Git, GitHub, and infrastructure workflows through an agent-based web dashboard.

## 프로젝트 개요

AegisOps는 FastAPI 백엔드와 React/Vite 프론트엔드로 구성된 DevOps·InfraOps 운영 플랫폼입니다. 운영자는 웹 대시보드에서 로컬 Kubernetes, Docker, Git 및 Windows 시스템 상태와 SQLite 기반 운영 데이터를 확인할 수 있습니다.

현재 데이터 소스는 다음과 같이 구분됩니다.

- **로컬 실시간 조회:** `kubectl`, `docker`, `git` 명령과 Windows 시스템 API를 이용한 읽기 전용 조회
- **SQLite 데모 데이터:** 클러스터, 네임스페이스, Pod, 컨테이너, 배포, 알림, 사용자, 감사 로그
- **시뮬레이션 Provider:** 외부 API나 실제 계정을 사용하지 않는 AWS/NCP Cloud Resources

## 주요 목표

- DevOps 운영 상태를 한 화면에서 확인
- Kubernetes Cluster, Namespace, Pod 상태 조회
- Docker Container 상태 조회
- Git Repository와 로컬 저장소 상태 확인
- Deployment History 확인 및 배포 트리거 요청
- Monitoring Metrics, Alerts, Audit Logs 확인
- JWT 기반 로그인, 회원가입, 사용자 인증
- WebSocket 기반 실시간 로그 스트림 제공
- Provider·Service 계층을 통한 운영 도구 확장 구조 유지
- Agent Runtime과 Workflow 중심의 운영 UI 제공

## 기술 스택

### Backend

- Python 3.10
- FastAPI / Uvicorn
- SQLAlchemy / SQLite
- Pydantic / pydantic-settings
- python-jose / passlib / bcrypt
- WebSocket
- Python 표준 라이브러리 기반 로컬 명령 및 Windows 시스템 조회

### Frontend

- React 18 / TypeScript
- Vite
- Axios
- Tailwind CSS
- lucide-react
- clsx / tailwind-merge

## 주요 기능

### 인증 / 사용자

- 이메일과 비밀번호를 이용한 로그인
- 사용자 이름, 이메일, 비밀번호, 권한을 이용한 회원가입
- JWT Access Token 발급
- Bearer Token 기반 현재 사용자 조회
- 새로고침 시 저장된 Token 검증
- 로그아웃 및 `401 Unauthorized` 응답 시 Token 제거

로그인은 OAuth2 Form 형식이며 화면에서 입력한 이메일을 Form의 `username` 필드로 전송합니다.

### Dashboard

- 실행 중인 Pod와 전체 Pod 수
- 실행 중인 Docker Container 수
- Kubernetes Deployment 가용 비율
- Windows CPU, Memory, Disk 사용률
- 현재 Git Branch와 변경 파일 수
- 각 데이터의 Source, Loading, 오류 상태 표시

### Kubernetes

- SQLite 기반 Cluster, Namespace, Pod 목록 조회
- Pod 재시작 요청과 재시작 횟수 반영
- 로컬 `kubectl get pods -A -o json` 기반 Live Pod 조회
- 로컬 Deployment와 Node 상태를 Dashboard Summary에 반영

### Docker

- SQLite 기반 Container 목록 조회
- 저장된 Container 상태값 변경
- 로컬 `docker ps --format "{{json .}}"` 기반 실행 중인 Container 조회

### Source Control

- 데모 Repository 목록 조회
- 로컬 Git Branch, 변경 파일, Remote 조회
- GitHub Actions Provider의 연결 준비 상태 표시

### Deployments / Workflows

- SQLite 기반 배포 이력 조회
- 배포 트리거에 대한 데모 응답
- Workflow와 Agent Runtime 상태를 표현하는 운영 UI
- ArgoCD, GitHub Actions, Jenkins Provider 상태 표시

### Monitoring / Alerts / Events

- 운영 메트릭 조회
- 알림 목록 조회 및 읽음 처리
- 운영 이벤트 Timeline UI
- Prometheus와 Grafana Provider 상태 표시

### Access Control

- 사용자 목록과 권한 조회
- Audit Log 목록 조회

### Cloud Resources

- AWS/NCP 시뮬레이션 리소스 카드
- Region, Instance, VPC, Subnet, IP, Load Balancer 상태 표시
- 실제 Cloud 계정, 자격증명, SDK 또는 외부 Cloud API를 사용하지 않음

### Log Stream

- `/ws/logs` WebSocket 엔드포인트 사용
- 현재는 서버에 정의된 운영 로그 예시를 2초 간격으로 전송

## 데이터 출처

| 영역 | 데이터 출처 | 현재 동작 |
|---|---|---|
| Dashboard Summary | 로컬 Runtime Provider | Kubernetes, Docker, Git, System 상태 통합 |
| Kubernetes 화면 | SQLite Seed | Cluster, Namespace, Pod 조회 및 재시작 카운트 변경 |
| Docker 화면 | SQLite Seed | Container 조회 및 저장 상태 변경 |
| Git 화면 | 고정 데모 목록 | Repository 목록 표시 |
| Live Git API | 로컬 Git 저장소 | Branch, 변경 파일, Remote 조회 |
| Deployments | SQLite·데모 응답 | 이력 조회와 Trigger 응답 |
| Monitoring | 생성된 데모 지표 | CPU, Memory, Disk 등 표시 |
| Cloud Resources | 고정 시뮬레이션 | AWS/NCP 리소스 카드 표시 |
| Integrations | 환경 설정 확인 | 외부 운영 도구의 연결 준비 상태 확인 |
| Log Stream | WebSocket 데모 | 운영 로그 예시 전송 |

로컬 Runtime 조회가 실패하면 가짜 실시간 값으로 대체하지 않습니다. 해당 Provider에 오류를 표시하고 나머지 Provider 응답은 유지합니다.

## API 구조

현재 FastAPI Router 기준입니다.

| 영역 | Prefix | 주요 기능 |
|---|---|---|
| Auth | `/api/auth` | `POST /login`, `POST /register`, `GET /me` |
| Kubernetes | `/api/k8s` | clusters, namespaces, pods, pod restart |
| Docker | `/api/docker` | containers, container status |
| Deployments | `/api/deployments` | history, trigger |
| Git | `/api/git` | repositories |
| Monitoring | `/api/monitoring` | metrics |
| Alerts | `/api/alerts` | alerts, read |
| Admin | `/api/admin` | users, audit logs |
| Runtime | `/api/runtime` | health |
| Dashboard | `/api/dashboard` | summary |
| Live Kubernetes | `/api/k8s/live` | pods |
| Live Docker | `/api/docker/live` | containers |
| Live Git | `/api/git/live` | status |
| Integrations | `/api/integrations` | status |
| Cloud | `/api/cloud` | aws, ncp |
| WebSocket | `/ws/logs` | realtime logs |

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)

## Provider / Service 구조

로컬 명령 실행은 Router나 React Component에 직접 포함하지 않습니다.

```text
API Router
└─ Dashboard Service
   ├─ Local Kubernetes Provider
   ├─ Local Docker Provider
   ├─ Local Git Provider
   └─ Local System Provider
```

- Router는 HTTP 요청과 응답을 담당합니다.
- Service는 여러 Provider 결과를 하나의 응답으로 조합합니다.
- Provider는 Runtime 조회와 오류 처리를 담당합니다.
- 로컬 명령은 프로젝트 루트에서 실행되며 8초 Timeout이 적용됩니다.
- AWS/NCP Provider는 고정된 시뮬레이션 데이터만 반환합니다.

## 프로젝트 구조

```text
AegisOps/
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth.py
│  │  │  ├─ k8s.py
│  │  │  ├─ docker.py
│  │  │  ├─ deployments.py
│  │  │  ├─ git.py
│  │  │  ├─ monitoring.py
│  │  │  ├─ alerts.py
│  │  │  ├─ admin.py
│  │  │  ├─ runtime.py
│  │  │  ├─ integrations.py
│  │  │  └─ cloud.py
│  │  ├─ core/
│  │  ├─ db/
│  │  ├─ models/
│  │  ├─ schemas/
│  │  ├─ providers/
│  │  │  ├─ integrations/
│  │  │  ├─ local_kubernetes_provider.py
│  │  │  ├─ local_docker_provider.py
│  │  │  ├─ local_git_provider.py
│  │  │  └─ local_system_provider.py
│  │  ├─ services/
│  │  │  ├─ dashboard_service.py
│  │  │  ├─ integration_service.py
│  │  │  ├─ cloud_service.py
│  │  │  └─ runtime.py
│  │  └─ main.py
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

- Python 3.10 권장
- Node.js와 npm

Live Runtime 조회에는 Docker Desktop, `kubectl`, Git CLI가 선택적으로 필요합니다. 사용할 수 없는 도구는 해당 카드에 연결 오류로 표시됩니다.

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

최초 설치 후에는 가상환경 활성화와 Uvicorn 실행 명령만 다시 사용하면 됩니다.

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
- Vite는 `/api`와 `/ws` 요청을 `127.0.0.1:8000`으로 전달합니다.

최초 설치 후에는 `npm run dev`만 다시 실행하면 됩니다.

## 데모 계정

초기 DB에 사용자가 없으면 다음 계정이 생성됩니다.

| 권한 | 이메일 | 비밀번호 |
|---|---|---|
| 관리자 | `admin@aegisops.local` | `admin123` |
| 운영 담당자 | `dev@aegisops.local` | `dev123` |
| 조회 전용 | `viewer@aegisops.local` | `view123` |

로그인은 사용자 이름이 아니라 **이메일**을 사용합니다.

## 개발 DB

- SQLite 파일: `backend/aegisops.db`
- 서버 시작 시 테이블 생성, SQLite Schema 보정, Seed 순서로 실행됩니다.
- 기존 사용자가 있으면 기본 계정을 다시 추가하지 않습니다.

완전 초기화가 필요한 경우에만 백엔드를 종료한 후 DB 파일을 삭제합니다. 저장된 사용자와 데모 데이터가 모두 삭제됩니다.

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

백엔드 실행 후:

```powershell
Invoke-RestMethod http://localhost:8000/api/runtime/health
Invoke-RestMethod http://localhost:8000/api/dashboard/summary
Invoke-RestMethod http://localhost:8000/api/k8s/live/pods
Invoke-RestMethod http://localhost:8000/api/docker/live/containers
Invoke-RestMethod http://localhost:8000/api/git/live/status
Invoke-RestMethod http://localhost:8000/api/cloud/aws
Invoke-RestMethod http://localhost:8000/api/cloud/ncp
```

### Frontend Build

```powershell
cd C:\Workspace\AegisOps\frontend
npm run build
```

## 현재 제한사항

- Kubernetes와 Docker 관리 화면은 SQLite 데모 데이터를 사용하며 Live API는 별도의 읽기 전용 조회입니다.
- Repository 목록은 데모 데이터이며 Live Git API만 로컬 저장소를 조회합니다.
- Deployment Trigger는 실제 Pipeline을 실행하지 않습니다.
- Monitoring API는 데모 지표를 생성합니다.
- WebSocket 로그는 실제 파일 Tail이 아니라 로그 예시를 전송합니다.
- AWS/NCP Cloud Resources는 실제 Cloud 연결이 아닌 시뮬레이션 환경입니다.
- Agent Runtime, Workflow, Security 및 일부 운영 도메인은 상태 표현용 UI이며 실제 자동 실행 엔진이나 모델 추론은 연결되어 있지 않습니다.

실제 운영 명령 실행이나 외부 Cloud 리소스 변경 기능은 현재 범위에 포함되지 않습니다.
