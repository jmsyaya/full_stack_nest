# 🧊 FrigoGo Backend (프리고고 백엔드 서버)
> **냉장고 속 남은 식재료 기반 AI 맞춤 레시피 & 게이미피케이션 집밥 커뮤니티 (Server)**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://16.184.30.214/api)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)](https://aws.amazon.com/)

---

## 📖 백엔드 프로젝트 소개
**FrigoGo**는 냉장고 속 식재료를 관리하고 남은 재료로 가능한 맞춤형 요리를 추천받아 완성하며, 요리 인증 및 집밥 커뮤니티 활동을 통해 경험치(XP)와 레벨이 상승하고 뱃지를 해금하는 **게이미피케이션 기반 요리 커뮤니티 플랫폼**입니다.

백엔드 서버는 **Node.js, NestJS, Prisma ORM**을 기반으로 설계되었으며, 단순한 CRUD를 넘어 **다중 소셜 인증(OAuth 2.0), OpenAI 연동 AI 레시피 추천 엔진, 집밥 커뮤니티(게시글·댓글·좋아요), 트랜잭션 기반 뱃지 보상 및 자동 레벨업 시스템, 그리고 주간 환경 통계(탄소 절감·절약 금액) 자동 연산 로직**을 안정적으로 처리합니다.

* **🔗 라이브 서비스 링크**: [https://frigogo.duckdns.org/](https://frigogo.duckdns.org/) (AWS EC2 · Ubuntu)
* **📘 API 명세서 (Swagger)**: [http://16.184.30.214/api](http://16.184.30.214:10000/api-docs)
* **📦 배포 전용 레포지토리**: `/deploy-frigogo`
* **📑 상세 기술 명세 및 트러블슈팅**: 👉 **[FrigoGo GitHub Wiki 바로가기](../../wiki)**

---

## 🛠 핵심 백엔드 구현 기능 (Core Features)

### 1. 회원 인증 및 보안 관리 (Auth & Security)
* **다중 인증 시스템**: 일반 로컬 이메일 가입/로그인 및 카카오, 구글, 네이버 **OAuth 2.0 소셜 로그인** 통합 지원.
* **계정 분리 아키텍처**: 이메일 중복 충돌을 방지하기 위해 `Member`와 `AuthAccount` 테이블을 분리 설계하여 플랫폼별 독립 가입 보장.
* **JWT & Redis 인가**: NestJS Passport 기반 가드(`JwtAuthGuard`, `OptionalJwtAuthGuard`)로 회원/비회원 권한을 유연하게 분기하고 보안 강화.

### 2. 스마트 냉장고 및 재료 관리 (Refrigerator)
* **식재료 CRUD 및 분량 관리**: 카테고리별 재료 관리 및 **소수점 자리까지의 분량 입력(예: 0.5단)** 지원.
* **유통기한 임박 감지**: D-5 이하 임박 재료 자동 판별 및 D-Day 배지 데이터 제공. (현재 구현 X) (추후 예정)
* **소비 vs 폐기 분리 처리**: 재료 삭제 시 '다 사용했어요(소비)'와 '버렸어요(폐기)'를 구분하여 주간 환경 리포트 지표에 자동 반영. (현재 구현 X) (추후 예정)

### 3. AI 맞춤 레시피 추천 엔진 (OpenAI Integration)
* **보유 재료 매칭 알고리즘**: 유저의 냉장고 재료와 레시피 필요량을 대조하여 추천 요리 알고리즘 구현.
* **OpenAI 연동**: 냉장고 재료 조합을 바탕으로 중복 없는 맞춤형 레시피 및 조리 단계(Step-by-Step) 생성.

### 4. 집밥 인증 커뮤니티 & 소셜 인터랙션 (Community & Feed)
* **요리 인증 자동 피드 생성**: 요리 상세 페이지에서 완성 사진(최대 3장)과 한 줄 코멘트를 업로드하면 재료 소진 처리와 동시에 커뮤니티 피드에 게시물이 자동 생성.
* **정렬 및 무한 스크롤 조회**: 최신순, 인기순(좋아요 수 기준) 정렬 기능 및 무한 스크롤 피드 데이터 제공.
* **좋아요 및 댓글 기능**: 좋아요 토글(`PostLike`), 댓글 작성·수정·삭제(최대 300자, 본인 작성 글/댓글에 대한 제어 권한 검증) 지원.

### 5. 뱃지 게이미피케이션 & 자동 레벨업 (XP & Badge Engine)
* **요리 인증 XP 산출**: 요리 완성 인증 시 기본 XP(`+20 XP`)에 **사용한 재료 수당 보너스(`+10 XP × 재료 수`)**를 더해 경험치를 지급.
* **구간별 목표 XP 테이블 기반 레벨 판정**: Lv.1(`30`)부터 Lv.30(`6000`)까지 설정된 커스텀 목표 경험치 테이블(`LEVEL_SETTINGS`)을 기준으로 누적 XP를 비교해 현재 레벨(최대 30레벨)과 다음 레벨 목표 XP 산출.
* **원자적 뱃지 해금 (`BadgeService`)**: 20개 이상의 활동 도메인 조건을 검사하고, `prisma.$transaction`을 통해 뱃지 발급(`UserBadge`)과 XP 지급(`Member.memberXp`) 간의 데이터 정합성을 보장하며 실시간 `unlockedBadges` 응답 반환.

### 6. 주간 리포트 및 환경 지표 자동 연산 (Weekly Report) (현재 구현 X) (추후 예정)
* 사용자의 일주일간 활동 데이터를 바탕으로 **소비한 재료 수, 버린 재료 수, 절약 금액(표준 단가 테이블 기준), CO2 절감량** 등 4대 핵심 지표를 자동 연산하여 주간 대시보드 제공.
* 주간 챌린지 달성 여부를 백그라운드에서 추적하고 리포트 진입 시 보상(XP +50) 지급 및 완료 모달 트리거.

---

## 🛠 기술 스택 (Tech Stack)

### Backend
* **Language & Runtime**: TypeScript, Node.js, NestJS
* **Database & ORM**: MySQL, Prisma ORM
* **Cache & Auth**: Redis, JWT, Passport, OAuth 2.0 (Kakao, Google, Naver)
* **API Documentation**: Swagger
* **External API & Storage**: OpenAI API, AWS S3

### Infrastructure & Deployment
* **Server**: AWS EC2 (Ubuntu, t3.small)
* **Web Server & Proxy**: Nginx (Reverse Proxy)
* **Process Manager**: PM2

---

## 🏗 시스템 및 배포 아키텍처

```text
[ Browser (사용자 접속) ]
         │
         ▼  (HTTP :80)
┌───────────────────────────────────────────────────────────┐
│                    AWS EC2 · Ubuntu                       │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │        Nginx (80번 포트 · 웹 서버 / Reverse Proxy)   │  │
│  └──────────────┬─────────────────────────┬────────────┘  │
│                 │ (정적 파일 서빙)         │ (API 프록시)  │
│                 ▼                         ▼               │
│  ┌──────────────────────────┐ ┌────────────────────────┐  │
│  │      React (Build)       │ │   NestJS (PM2 :10000)  │  │
│  │   /var/www/frigogo       │ │      frigogo-api       │  │
│  └──────────────────────────┘ └───────────┬────────────┘  │
│                                           │ (Localhost)   │
│                                           ▼               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │        MySQL (:3306) + Redis (:6379) [외부 차단]     │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```
---

## 🌐 서비스 접속 및 환경 구성 안내

본 프로젝트는 **Docker 기반 인프라(MySQL, Redis)** 및 다수의 외부 API(OpenAI, AWS S3, Kakao/Google/Naver OAuth)와 연동되어 동작합니다. 
보안상 핵심 API 키와 환경변수(`.env`)는 비공개로 관리되므로, **AWS EC2에 배포된 라이브 서버**를 통해 모든 기능을 바로 테스트하실 수 있습니다.

* **🔗 라이브 서비스 바로가기**: [https://frigogo.duckdns.org/](https://frigogo.duckdns.org/)

<details>
<summary><b>⚙️ 주요 환경변수(.env) 구성 명세 (참고용)</b></summary>

```env
# Server & Database
PORT=10000
DATABASE_URL="mysql://<USER>:<PASSWORD>@localhost:3306/frigogo_project"
REDIS_URL="redis://:<PASSWORD>@localhost:6379/0"

# Auth & OAuth 2.0
JWT_SECRET="<JWT_SECRET_KEY>"
BLACKLIST_PREFIX="blacklist:"
REFRESH_PREFIX="refresh:"

KAKAO_REST_API_KEY="<KAKAO_REST_API_KEY>"
KAKAO_CLIENT_SECRET="<KAKAO_CLIENT_SECRET>"
KAKAO_CALLBACK_URL="<KAKAO_CALLBACK_URL>"

GOOGLE_CLIENT_ID="<GOOGLE_CLIENT_ID>"
GOOGLE_CLIENT_SECRET="<GOOGLE_CLIENT_SECRET>"
GOOGLE_CALLBACK_URL="<GOOGLE_CALLBACK_URL>"

NAVER_CLIENT_ID="<NAVER_CLIENT_ID>"
NAVER_CLIENT_SECRET="<NAVER_CLIENT_SECRET>"
NAVER_CALLBACK_URL="<NAVER_CALLBACK_URL>"

# AI & Cloud Storage
OPENAI_API_KEY="<OPENAI_API_KEY>"

UNSPLASH_KEY="<UNSPLASH_KEY>"

AWS_REGION="ap-northeast-2"
AWS_S3_BUCKET="<S3_BUCKET_NAME>"
AWS_ACCESS_KEY_ID="<AWS_ACCESS_KEY_ID>"
AWS_SECRET_ACCESS_KEY="<AWS_SECRET_ACCESS_KEY>"
```
</details>

---

## 👥 팀원 및 역할

| 이름 | 역할 | 담당 기능 |
| :---: | :---: | :--- |
| **[정명식]** | Fullstack | • **통합 회원 인증 아키텍처 구축** (로컬 가입/로그인 및 카카오·구글·네이버 OAuth 2.0, JWT/Redis 인가)<br>• **경험치(XP) & 자동 레벨업 시스템 설계** (활동별 동적 XP 산출, 누적 XP 기반 레벨 계산 및 Zustand 상태 동기화)<br>• **뱃지 게이미피케이션 엔진 구축** (`BadgeService` 트랜잭션 처리, 전 도메인 API 연동 및 실시간 해금 모달 구현) |
| **[전아림]** | Fullstack | • **요리인증 커뮤니티 & 마이레시피 설계** <br>• **AWS EC2 인프라 구축 및 Nginx Reverse Proxy 배포 파이프라인 운영** |
| **[이유진]** | Fullstack | • OpenAI 기반 맞춤 레시피 추천 알고리즘 및 식재료 관리 API 설계 |
