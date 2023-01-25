import {Inngest} from 'inngest'

const inngest = new Inngest({name: 'Venice'})

export default inngest.createStepFunction(
  'My first function',
  'test/demo',
  ({event, tools}) => {
    console.log('Will sleep')
    tools.sleep('1 second')
    console.log('Did sleep')
    return {event, body: 'hello!'}
  },
)
