# AegisOps

AI 기반 DevOps 운영 환경에서 Kubernetes, Docker, GitHub, CI/CD Pipeline, Monitoring 상태를 통합 관리할 수 있도록 설계한 **AI DevOps Operations Platform** 입니다.

기존 운영 환경에서는 Kubernetes, Docker, Git, Monitoring, Cloud Infrastructure 상태를 각각 다른 도구에서 확인해야 하며, 장애 발생 시 운영자가 직접 로그와 메트릭을 분석해야 하는 문제가 존재합니다.

AegisOps는 이러한 문제를 해결하기 위해 **운영 상태 통합 Dashboard + AI 기반 운영 분석 Assistant + 실시간 Event Monitoring** 구조를 목표로 개발하였습니다.

---

## 프로젝트 목표

기존 DevOps 운영 환경의 문제점

* Kubernetes, Docker, Git 상태가 여러 도구로 분산되어 있음
* 운영자가 직접 로그와 메트릭을 확인해야 함
* 장애 원인 분석 과정이 수동으로 이루어짐
* CI/CD Pipeline 상태를 통합적으로 보기 어려움
* 운영 환경 변경 명령은 위험성이 높음

이를 해결하기 위해 AI 기반 통합 운영 플랫폼을 설계하였습니다.

---

## 핵심 기능

### 1. Unified Operations Dashboard

단일 화면에서 운영 상태 통합 조회

지원 대상

* Kubernetes Cluster
* Docker Container
* Git Repository
* GitHub Repository
* Cloud Resources
* Prometheus Metrics
* Jenkins Pipeline
* Runtime Health

---

### 2. AI Operations Assistant

Local LLM 기반 운영 분석 기능 구현

분석 흐름

```text
Dashboard State
      ↓
Recent Event History
      ↓
LLM Analysis
      ↓
Risk Assessment
      ↓
Root Cause Prediction
      ↓
Recommended Action
```

AI Assistant는 운영 상태를 기반으로

* 위험도 분석
* 장애 원인 예측
* 권장 조치 제안

기능을 수행합니다.

---

### 3. Real-time Event Monitoring

WebSocket 기반 실시간 상태 반영

지원 기능

* Live Logs Stream
* Recent Events Update
* Alert Monitoring
* Runtime Status Update

---

### 4. Provider Architecture

확장 가능한 구조 설계

```text
API Router
      ↓
Service Layer
      ↓
Provider Layer
      ↓
Infrastructure Runtime
```

지원 Provider

* Kubernetes Provider
* Docker Provider
* Git Provider
* System Provider
* Cloud Provider
* Monitoring Provider

---

### 5. Safe Action Simulation

실제 운영 환경 변경을 방지하기 위한 안전 설계

지원 구조

* Demo Mode
* Read Only Runtime Query
* Command Execution Block
* Safe Action Simulation

환경 변수

```text
DEMO_MODE=true
ALLOW_REAL_COMMANDS=false
```

실제 Kubernetes, Docker, Git 명령은 수행하지 않도록 설계하였습니다.

---

## 기술 스택

Backend

* Python
* FastAPI
* SQLAlchemy
* WebSocket
* SQLite
* JWT Authentication

Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

Infrastructure

* Docker
* Kubernetes
* GitHub API
* Jenkins API
* Prometheus API

AI

* Ollama
* Local LLM
* Prompt Engineering
* Context Aware Analysis

---

## 개발하면서 집중한 부분

* Full Stack DevOps Platform 직접 설계
* Real-time Dashboard Architecture 구현
* AI 기반 운영 분석 Assistant 설계
* Provider 기반 확장 구조 설계
* Safe Action Simulation 구조 설계
* WebSocket 기반 Event Streaming 구현

---

## 기대 효과

* 운영 상태 통합 모니터링 가능
* 장애 원인 분석 시간 단축 가능
* AI 기반 운영 자동화 가능
* DevOps 운영 효율 향상 가능
