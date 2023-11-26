// Inspired by import 'global-agent/bootstrap'
// But using undici instead of http(s) module becuase we are using fetch
import {ProxyAgent, setGlobalDispatcher} from 'undici'

if (process.env['GLOBAL_AGENT_HTTP_PROXY']) {
  setGlobalDispatcher(new ProxyAgent(process.env['GLOBAL_AGENT_HTTP_PROXY']))
}
