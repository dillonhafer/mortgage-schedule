#!/usr/bin/osascript

tell application "iTerm2"
  tell current window
    set serverTab to (create tab with default profile)
    tell sessions[1] of serverTab to split vertically with default profile
    tell sessions[1] of serverTab to write text "yarn start"
    tell sessions[2] of serverTab to write text "yarn run sass"
    select first tab
  end tell
end tell
