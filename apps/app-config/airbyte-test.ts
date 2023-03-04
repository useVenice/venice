import type {AirbyteConfig, AirbyteStreamBase} from 'faros-airbyte-cdk'
import {
  AirbyteLogger,
  AirbyteSourceBase,
  AirbyteSourceRunner,
  AirbyteSpec,
} from 'faros-airbyte-cdk'
import VError from 'verror'

interface SourceConfig extends AirbyteConfig {
  readonly user: string
}

export class ExampleSource extends AirbyteSourceBase<SourceConfig> {
  async spec(): Promise<AirbyteSpec> {
    return new AirbyteSpec({connectionSpecification: {}})
  }
  async checkConnection(
    config: SourceConfig,
  ): Promise<[boolean, VError | undefined]> {
    if (config.user === 'chris') {
      return [true, undefined]
    }
    return [false, new VError('User is not chris')]
  }
  streams(): AirbyteStreamBase[] {
    return []
  }
}

/** The main entry point. */
export function mainCommand() {
  const logger = new AirbyteLogger()
  const source = new ExampleSource(logger)
  return new AirbyteSourceRunner(logger, source).mainCommand()
}

mainCommand().parseAsync(process.argv)
