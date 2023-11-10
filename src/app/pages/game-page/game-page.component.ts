import {AfterViewChecked, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as PIXI from 'pixi.js'


@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.scss'
})

export class GamePageComponent {

  app!: PIXI.Application<HTMLCanvasElement>;

  ticker!: PIXI.Ticker;

  groundTexture!: PIXI.Texture;

  skyTexture!: PIXI.Texture;

  groundTilingSprite!: PIXI.TilingSprite;

  skyTilingSprite!: PIXI.TilingSprite;

  constructor() {
    this.init()
  }

  init() {
    this.app = new PIXI.Application<HTMLCanvasElement>({width: 800, height: 600})
    document.body.appendChild(this.app.view)
    this.ticker = PIXI.Ticker.shared;
    this.createTextures()
  }

  createTextures() {
    this.groundTexture = PIXI.Texture.from("../../../assets/ground.png");
    this.skyTexture = PIXI.Texture.from("../../../assets/sky.png");
    this.groundTilingSprite = new PIXI.TilingSprite(
      this.groundTexture, this.app.screen.width, this.app.screen.height
    )
    this.skyTilingSprite = new PIXI.TilingSprite(
      this.skyTexture, this.app.screen.width, this.app.screen.height
    )
    this.app.stage.addChild(this.skyTilingSprite, this.groundTilingSprite)
    console.log(this.skyTilingSprite.tilePosition)
    this.ticker.add(() => {
      this.groundTilingSprite.tilePosition.x -= 1;
      this.skyTilingSprite.tilePosition.x -= 0.2;
    })
  }

  animateEnvironment() {
    this.groundTilingSprite.tilePosition.x -= 1;
    this.skyTilingSprite.tilePosition.x -= 0.2;
  }

}
