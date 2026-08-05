#!/bin/bash
cd /home/z/my-project
while true; do
  bun run dev >> /home/z/my-project/dev.log 2>&1
  echo "[respawn] dev server exited at $(date), restarting in 2s..." >> /home/z/my-project/dev.log 2>&1
  sleep 2
done
