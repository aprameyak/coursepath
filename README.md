# CoursePath

A tool for comparing education programs by what happens to graduates. Add bootcamps, university programs, or online courses, report graduate outcomes, and see each program's employment rate and median salary.

## Features

- Add a program with name, type (bootcamp, university, online), cost, and length in weeks
- Report an outcome for a program: employed or not, salary, graduation date, and months to first job
- Each program shows its employment rate and median salary once outcomes exist
- Entries are saved to a local JSON file

## Getting started

Requires Node.js.

```bash
npm install
npm start
```

Then open http://localhost:3003. `npm run dev` runs the same command.

## How it works

- `index.html` has two forms (add a course, report an outcome) and a list of courses with their stats. It calls the API at `http://localhost:3003`.
- `server.js` is an Express app that serves the page and exposes:
  - `POST /api/courses` and `POST /api/outcomes` to save programs and outcomes.
  - `GET /api/courses` to list programs with computed `employmentRate` and `medianSalary`.
  - `GET /api/courses/:id` to return one program and all of its outcome reports.
- Data is written to `data.json`, created on first run and ignored by git. `utils.js` holds helpers not yet wired in.

## Status

Prototype. Outcomes are self-reported in this app only; nothing is verified or imported from schools.

## License

MIT, see [LICENSE](LICENSE).
