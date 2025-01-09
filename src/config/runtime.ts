export const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge';

export const runtime = isEdgeRuntime ? 'edge' : 'nodejs';

