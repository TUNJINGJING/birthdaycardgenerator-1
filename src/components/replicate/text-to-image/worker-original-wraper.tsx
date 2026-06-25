import WorkerOriginal from "@/components/replicate/text-to-image/worker-original";
import { getEffectById } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";

export default async function WorkerOriginalWraper(params: {
  effectId: string;
  multiLanguage: string;
  outputDefaultImage: string;
}) {
  const effect: Effect | null = await getEffectById(Number(params.effectId));
  if (!effect) return null;
  return (
    <WorkerOriginal
      effectId={effect.id}
      credit={effect.credit}
      defaultImage={params.outputDefaultImage}
      lang={params.multiLanguage}
    />
  );
}
