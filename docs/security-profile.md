# Security Profile

## Project surface

Detected languages:

- JavaScript

## Sensitive change areas

- Authentication and authorization
- Secret handling
- Filesystem paths
- Shell command execution
- Network requests
- Dependency loading
- User-supplied parsers or templates

## Review expectations

- Add explicit threat-model notes for sensitive changes.
- Prefer small pull requests for high-risk areas.
- Treat generated workflow changes as security-relevant.
