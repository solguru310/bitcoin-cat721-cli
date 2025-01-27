import { Option, SubCommand } from 'nest-commander';
import {
  logerror,
  getTrackerStatus,
  getNfts,
  btc,
  getCollectionsByOwner,
} from 'src/common';
import { BaseCommand, BaseCommandOptions } from '../base.command';
import { ConfigService, WalletService } from 'src/providers';
import { Inject } from '@nestjs/common';
import { findCollectionInfoById } from 'src/collection';
import { table } from './table';
import Decimal from 'decimal.js';

interface BalanceCommandOptions extends BaseCommandOptions {
  id: string;
}

@SubCommand({
  name: 'balances',
  description: 'Get balances of nft',
})
export class BalanceCommand extends BaseCommand {
  constructor(
    @Inject() protected readonly walletService: WalletService,
    @Inject() protected readonly configService: ConfigService,
  ) {
    super(walletService, configService);
  }

  async checkTrackerStatus() {
    const status = await getTrackerStatus(this.configService);
    if (status instanceof Error) {
      throw new Error('tracker status is abnormal');
    }

    const { trackerBlockHeight, latestBlockHeight } = status;

    if (trackerBlockHeight < latestBlockHeight) {
      console.warn('tracker is behind latest blockchain height');
      console.warn(
        `processing ${trackerBlockHeight}/${latestBlockHeight}: ${new Decimal(trackerBlockHeight).div(latestBlockHeight).mul(100).toFixed(0)}%`,
      );
    }
  }
  async cat_cli_run(
    passedParams: string[],
    options?: BalanceCommandOptions,
  ): Promise<void> {
    const address = this.walletService.getAddress();

    if (!options.id) {
      this.showAllColloction(address);
      return;
    }

    this.showOneCollection(options.id, address);
  }

  async showOneCollection(collectionId: string, address: btc.Address) {
    try {
      const collectionInfo = await findCollectionInfoById(
        this.configService,
        collectionId,
      );

      if (!collectionInfo) {
        logerror(
          `No collection found for collectionId: ${collectionId}`,
          new Error(),
        );
        await this.checkTrackerStatus();
        return;
      }

      const nfts = await getNfts(
        this.configService,
        collectionInfo,
        address,
        null,
      );

      if (nfts) {
        console.log(
          table(
            nfts.contracts.map((token) => {
              return {
                nft: `${collectionInfo.collectionId}:${token.state.data.localId}`,
                symbol: collectionInfo.metadata.symbol,
                //content: `${this.configService.getTracker()}/api/collections/${collectionInfo.tokenId}/localId/${token.state.data.localId}/content`,
              };
            }),
          ),
        );
      }
    } catch (error) {
      logerror('Get Balance failed!', error);
    }
  }

  async showAllColloction(address: btc.Address) {
    const collectionIds = await getCollectionsByOwner(
      this.configService,
      address.toString(),
    );

    for (let i = 0; i < collectionIds.length; i++) {
      await this.showOneCollection(collectionIds[i], address);
    }
  }

  @Option({
    flags: '-i, --id [collectionId]',
    description: 'ID of the collection',
  })
  parseId(val: string): string {
    return val;
  }
}
