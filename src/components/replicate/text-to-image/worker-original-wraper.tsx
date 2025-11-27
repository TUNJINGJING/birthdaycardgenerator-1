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
      model={effect.model}
      effect_link_name={effect.link_name}
      version={effect.version}
      credit={effect.credit}
      defaultImage={params.outputDefaultImage}
      lang={params.multiLanguage}
    />
  );
}
