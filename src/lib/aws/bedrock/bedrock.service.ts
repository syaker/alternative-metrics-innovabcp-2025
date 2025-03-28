import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandOutput,
} from '@aws-sdk/client-bedrock-runtime';
import { Injectable, Logger } from '@nestjs/common';
import configuration from '../../../config/configuration';
import { RawCommandOutput } from './bedrock.types';

@Injectable()
export class BedrockService {
  private readonly logger = new Logger(BedrockService.name);

  private awsConfig: {
    services: {
      bedrock: {
        modelId: string;
        anthropicVersion: string;
        maxToken: number;
        temperature: number;
      };
      defaultRegion: string;
    };
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  private readonly bedrockClient: BedrockRuntimeClient;

  constructor() {
    this.awsConfig = configuration().aws;

    this.bedrockClient = new BedrockRuntimeClient({
      region: this.awsConfig?.services.defaultRegion,
      credentials: this.awsConfig?.credentials,
    });
  }

  public async invokeModelWith(prompt: string, base64Image: string): Promise<RawCommandOutput> {
    if (!this.awsConfig) {
      throw new Error('AWS config not available. Cannot set up bedrock client');
    }

    const {
      services: {
        bedrock: { anthropicVersion, maxToken, modelId, temperature },
      },
    } = this.awsConfig;

    let commandOutput: InvokeModelCommandOutput | null = null;

    try {
      commandOutput = await this.bedrockClient.send(
        new InvokeModelCommand({
          modelId,
          contentType: 'application/json',
          body: JSON.stringify({
            anthropic_version: anthropicVersion,
            max_tokens: maxToken,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: 'image/jpeg',
                      data: base64Image,
                    },
                  },
                  { type: 'text', text: prompt },
                ],
              },
            ],
            temperature,
          }),
        }),
      );
    } catch (error) {
      this.logger.error('Could not invoke model', error);
      this.logger.error(error);

      throw error;
    }

    const { buffer } = commandOutput.body;

    return JSON.parse(new TextDecoder().decode(buffer)) as RawCommandOutput;
  }
}
