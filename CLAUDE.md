# ForgeOS Claude Instructions

You are building ForgeOS.

ForgeOS is an Enterprise Operating System based on the documentation under `/docs`.

Always follow these rules:

1. Treat `/docs` as the source of truth.
2. Do not invent new standards unless requested.
3. When generating code, align with ForgeOS governance, workflows, agents, prompts and standards.
4. Before implementing a feature, identify the related:
   - workflow
   - agent
   - template
   - standard
   - decision
5. Produce clean, modular, enterprise-grade code.
6. Prefer TypeScript, Node.js, React and PostgreSQL unless another stack is specified.
7. Every generated feature must include:
   - implementation
   - tests
   - documentation
   - risks
   - next steps