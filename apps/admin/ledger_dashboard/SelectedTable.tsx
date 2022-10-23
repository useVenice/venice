import {Table} from '@airplane/views'

import type {TableTitle} from './table'

const SelectedTable = ({title}: {title: TableTitle}) => (
  <Table title={title} task={`list_${title.toLowerCase()}`} />
)

export default SelectedTable
