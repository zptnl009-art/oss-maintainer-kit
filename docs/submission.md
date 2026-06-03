# Codex for Open Source Submission Packet

Use this page as the final copy/paste packet for the OpenAI Codex for Open Source form.

Form URL: <https://openai.com/ko-KR/form/codex-for-oss/>

## Personal fields

- Last name: enter manually
- First name: enter manually
- Email: enter the email on the ChatGPT account
- GitHub username: `zptnl009-art`
- OpenAI organization ID: enter manually from <https://platform.openai.com/>

## Repository field

GitHub repository URL:

```text
https://github.com/zptnl009-art/oss-maintainer-kit
```

## Role field

Select:

```text
주 책임자
```

## Interest field

Select both:

```text
Codex Security
프로젝트에 사용할 API 크레딧
```

## Why this repository fits

```text
oss-maintainer-kit은 OSS 메인테이너가 PR 검토, 이슈 triage, 릴리스 검증, 보안 점검을 표준화하도록 돕는 공개 도구입니다. CLI와 GitHub Action으로 AGENTS.md, PR/Issue 템플릿, release/security 문서, PR risk summary를 설치·검증합니다. 신생 프로젝트지만 실제 유지관리 워크플로 자동화와 외부 repo 채택을 목표로 설계했습니다.
```

## API credit usage plan

```text
API 크레딧은 opt-in 기능으로 PR diff 위험 요약, issue label/triage 제안, release note/checklist 생성, security-sensitive change summary 자동화에 사용할 계획입니다. 현재 deterministic risk category를 기반으로 모델 입력을 안정화하고, 최종 판단은 maintainer가 하도록 설계해 반복 review 시간을 줄이겠습니다.
```

## Anything else

```text
현재 repo는 테스트 13개 통과, maintainer readiness 100/100, GitHub Action/CLI/패키징 dry-run 검증 완료 상태입니다. 다음 단계는 3~5개 외부 OSS repo에 installation PR을 제출하고 docs/adoption.md에 공개 채택 증거를 축적하는 것입니다.
```

## Final checklist

- [ ] Repository is public.
- [ ] Repository default page shows the latest commit.
- [ ] `main` contains the latest commit.
- [ ] Optional: change GitHub default branch to `main` in repository settings.
- [ ] CI is passing on GitHub.
- [ ] Personal fields are filled manually.
- [ ] OpenAI organization ID is copied from the platform dashboard.
