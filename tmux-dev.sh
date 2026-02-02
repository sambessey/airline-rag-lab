#!/usr/bin/env bash

SESSION="dev"
DIR="/Users/sam/Development/ai/airline-rag-lab/utilities"

tmux new-session -d -s "$SESSION" -c "$DIR"
tmux split-window -h -t "$SESSION" -c "$DIR"
tmux send-keys -t "$SESSION:0.1" "claude" C-m
tmux select-pane -t "$SESSION:0.0"
tmux attach-session -t "$SESSION"
