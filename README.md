# JW Study Companion

A Windows desktop personal-study organiser built with Electron. It is local-first: notes, highlights, schedules and imported files are stored on the device and remain available offline.

## Important source-policy boundary
- JW.ORG is the only approved source for official religious information.
- The app does not generate religious facts or claim that an imported file is verified.
- JW.ORG resources open in the user's browser through an allowlisted HTTPS link handler.
- Publication files must be obtained by the user from JW.ORG or another source they are authorised to use, then imported.
- Personal notes and monthly reflections are user-generated, not official JW.ORG teaching.
- This first version does not scrape JW.ORG, crawl its full catalogue, or use an AI model. Those integrations require a supported and permitted source/API workflow.

## Requirements
- Windows 10/11
- Node.js 20 or newer
- Internet connection for `npm install` and opening JW.ORG resources

## Run
1. Extract this folder.
2. Open Command Prompt in this folder.
3. Run `npm install`
4. Run `npm start`

## Build a Windows installer
Run `npm run dist`. The installer will be created in `release/`.

## Offline behaviour
The app and locally imported files/notes work offline. JW.ORG links and online publication browsing require an internet connection. Imported files are copied into the app's local data folder.

## Current features
- Dashboard and study library
- Add publications or personal study tracks
- Paragraph progress and completion estimates
- Daily time allocation for reading, meditation and review
- One-hour-before reminders while the app is running
- Quick notes, research notes and study notes
- Highlights and monthly personal reflection based on saved highlights
- Local document import and offline file opening
- JSON data backup export

## Planned next-stage integrations
- Verified JW.ORG catalogue search and publication metadata
- In-app online reader with permitted JW.ORG links
- Better PDF text extraction and paragraph counting
- Windows startup/background reminder service
- Optional encrypted backup/sync across devices
