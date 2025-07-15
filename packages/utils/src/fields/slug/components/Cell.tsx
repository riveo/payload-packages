import type { DefaultCellComponentProps, GroupFieldClient } from 'payload';

const Cell = (
  props: DefaultCellComponentProps<GroupFieldClient, { value?: string | null }>,
) => {
  return props.cellData?.value;
};

export default Cell;
