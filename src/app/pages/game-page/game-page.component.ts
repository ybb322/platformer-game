import {AfterViewChecked, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as PIXI from 'pixi.js'
import * as TWEEN from '@tweenjs/tween.js'

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

  person!: PIXI.Sprite;

  jumpTween!: TWEEN.Tween<PIXI.ObservablePoint<any>>

  landTween!: TWEEN.Tween<PIXI.ObservablePoint<any>>

  corgi!: PIXI.Sprite;

  corgiRunningTexture!: PIXI.Texture;

  constructor() {
    this.init()
  }

  init() {
    this.app = new PIXI.Application<HTMLCanvasElement>({width: 800, height: 600})
    document.body.appendChild(this.app.view)
    this.ticker = PIXI.Ticker.shared;
    this.handleTextures()
    this.handleCorgi()
  }

  handleTextures() {
    this.groundTexture = PIXI.Texture.from("../../../assets/ground.png");
    this.skyTexture = PIXI.Texture.from("../../../assets/sky.png");
    this.groundTilingSprite = new PIXI.TilingSprite(
      this.groundTexture, this.app.screen.width, this.app.screen.height
    )
    this.skyTilingSprite = new PIXI.TilingSprite(
      this.skyTexture, this.app.screen.width, this.app.screen.height
    )
    this.person = PIXI.Sprite.from('../../../assets/person.png');
    this.app.stage.addChild(this.skyTilingSprite, this.groundTilingSprite)

    this.ticker.add(() => {
      this.groundTilingSprite.tilePosition.x -= 1;
      this.skyTilingSprite.tilePosition.x -= 0.2;
    })
  }

  handlePerson() {
    this.person = PIXI.Sprite.from("../../../assets/person.png");
    this.app.stage.addChild(this.person)
    this.person.y = 75;
    this.person.x = -200;
    // this.jumpTween = new TWEEN.Tween(this.person.position).to({y: -20}, 350).easing(TWEEN.Easing.Quadratic.Out);
    // this.landTween = new TWEEN.Tween(this.person.position).to({y: 75}, 350).easing(TWEEN.Easing.Quadratic.In);
    // this.jumpTween.chain(this.landTween);

    const jumping = () => {
      console.log('jumping!')
      this.jumpTween.update()
      this.landTween.update()
      this.landTween.onComplete(() => {
        console.log('removed!')
        this.ticker.remove(jumping)
      })
    }

    document.addEventListener('keyup', event => {
      if (event.code === 'Space') {
        this.jumpTween.start()
        this.ticker.add(jumping)
      }
    })
  }

  handleCorgi() {
    const corgiRunningTextureOne = PIXI.Texture.from('../../../assets/corgi_running_1.png')
    const corgiRunningTextureTwo = PIXI.Texture.from('../../../assets/corgi_running_2.png')
    this.corgiRunningTexture = corgiRunningTextureOne;
    this.corgi = PIXI.Sprite.from(this.corgiRunningTexture)
    this.app.stage.addChild(this.corgi)
    this.corgi.y = 400;
    this.corgi.x = 50;

    this.jumpTween = new TWEEN.Tween(this.corgi.position).to({y: 320}, 350).easing(TWEEN.Easing.Quadratic.Out);
    this.landTween = new TWEEN.Tween(this.corgi.position).to({y: 400}, 350).easing(TWEEN.Easing.Quadratic.In);
    this.jumpTween.chain(this.landTween);

    const jumping = () => {
      console.log('jumping!')
      this.jumpTween.update()
      this.landTween.update()
      this.landTween.onComplete(() => {
        console.log('removed!')
        this.ticker.remove(jumping)
      })
    }

    document.addEventListener('keyup', event => {
      if (event.code === 'Space') {
        this.jumpTween.start()
        this.ticker.add(jumping)
      }
    })


    setInterval(() => {
      console.log(this.corgiRunningTexture.textureCacheIds)
      if (this.corgi.texture === corgiRunningTextureOne) {
        this.corgi.texture = corgiRunningTextureTwo
      } else {
        this.corgi.texture = corgiRunningTextureOne
      }
    }, 150)


  }

}
