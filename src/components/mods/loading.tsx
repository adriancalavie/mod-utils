import { Progress } from "../ui/progress";

function clamp(progress: number): number {
  return Math.min(Math.max(progress, 0), 100);
}

type ProgressProps = {
  value: number;
  status: string;
};

export function LoadingProgress({ value, status }: ProgressProps) {
  return (
    <section className="mx-auto flex w-full flex-col items-center text-lg">
      <div className="flex w-full max-w-[66%] flex-col gap-2">
        <Progress value={clamp(value)} />
        <p>
          {status}
          <span className="hidden md:inline"> - {value.toFixed(2)}%</span>
        </p>
      </div>
    </section>
  );
}
