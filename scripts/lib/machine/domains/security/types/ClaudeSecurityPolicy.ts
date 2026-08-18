export interface ClaudeSecurityPolicy {
  profiles: ["claude-personal", "claude-favish"]
  defaultMode: "auto"
  skipDangerousModePermissionPrompt: false
  remoteControlAtStartup: boolean
  remoteControlExceptionReason?: string
}
