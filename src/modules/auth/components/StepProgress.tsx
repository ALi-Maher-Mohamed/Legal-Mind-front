type StepProgressProps = {
  step: number;
  total?: number;
  label: string;
};

export default function StepProgress({ step, total = 3, label }: StepProgressProps) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block">{label}</span>
      <div
        className="h-1 bg-white/10 w-full mt-4 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-[#F6C453] transition-all duration-300 rounded-full"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
