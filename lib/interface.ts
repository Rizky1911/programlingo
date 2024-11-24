export interface Output {
    stdout: string | null,
    stderr: string | null,
    compile_output: string | null,
    time: string | null,
    message: string | null,
    token: string | null,
    memory: number,
    status: {
      id: number,
      description: string,
    }
}