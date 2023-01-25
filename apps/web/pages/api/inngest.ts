import {serve} from 'inngest/next'
import demoFn, {scheduleSyncs} from '../../inngest/demo'

export default serve('Venice', [demoFn, scheduleSyncs])
