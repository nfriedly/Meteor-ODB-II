#!/usr/bin/env expect

spawn meteor deploy odb-ii
expect "Email: "
send "$env(EMAIL)\n"
expect "Password: "
# hide expect's output so it's not sharing my password with the world
log_user 0
send "$env(PASS)\n"
log_user 1
interact