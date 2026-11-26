JW STUDY COMPANION — WINDOWS INSTALLER BUILD

You do not need to install Node.js, npm, Electron, or use Command Prompt on your PC.
GitHub Actions builds the Windows installer for you.

1. Sign in to https://github.com/ (create a free account if needed).
2. Click the + button, choose New repository, name it jw-study-companion, choose Public or Private, then Create repository.
3. In the empty repository, choose Add file > Upload files.
4. Extract this ZIP on your PC. Open the JW-Study-Companion folder and upload ALL its contents, including the hidden .github folder and this README-GITHUB-BUILD.txt file. The .github folder contains the build workflow. If your browser's file picker does not show hidden folders, enable showing hidden items or use GitHub's Add file > Create new file route to create .github/workflows/build-windows.yml and paste in the workflow from the ZIP.
5. Commit the uploaded files to the main branch.
6. Open the repository's Actions tab. Select Build Windows Installer. Click Run workflow, keep the branch as main, then click the green Run workflow button.
7. Wait for the run to finish successfully. Open that run, scroll to Artifacts, and download JW-Study-Companion-Windows-Installer.
8. Extract the downloaded artifact ZIP. Inside is JW Study Companion Setup.exe. Double-click it to install.

If Actions is disabled, open the Actions tab and enable workflows for the repository.

IMPORTANT
- The installer is unsigned, so Windows SmartScreen may show an unknown-publisher warning. Only run the installer you built from your own repository and reviewed source.
- This builds the current source project. Features described as planned in the original README are not magically added by building it; the build only packages what is currently implemented.
