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
    this.app = new PIXI.Application<HTMLCanvasElement>({width: 1000, height: 600})
    document.body.appendChild(this.app.view)
    this.ticker = PIXI.Ticker.shared;
    this.handleTextures()
    this.handleSprites()
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


  handleSprites() {
    const corgiRunningTextureOne = PIXI.Texture.from('../../../assets/corgi_running_1.png')
    const corgiRunningTextureTwo = PIXI.Texture.from('../../../assets/corgi_running_2.png')
    const corgiJumpingTexture = PIXI.Texture.from('../../../assets/corgi_jumping_1.png')
    this.corgiRunningTexture = corgiRunningTextureOne;
    this.corgi = PIXI.Sprite.from(this.corgiRunningTexture)
    this.app.stage.addChild(this.corgi)
    this.corgi.y = 400;
    this.corgi.x = 50;

    const bone = PIXI.Sprite.from('../../../assets/bone_1.png')
    let randomBoneSpeed = Math.floor(Math.random() * 5) + 3;
    let randomBonePosX = Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000;
    let randomBonePosY = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
    let boneFlyoverPositions = [450, 400, 350, 320];
    let randomIndex = Math.floor(Math.random() * boneFlyoverPositions.length);
    let randomFlyoverPosition = boneFlyoverPositions[randomIndex]
    bone.x = randomBonePosX;
    bone.y = randomBonePosY;


    let boneFlyoverTween = new TWEEN.Tween(bone.position).to({y: randomFlyoverPosition}, 1550).easing(TWEEN.Easing.Quadratic.Out);

    this.app.stage.addChild(bone)
    const boneMoving = (speedX: number) => {
      bone.x -= randomBoneSpeed;
    }

    this.ticker.add(() => {
      boneFlyoverTween.update()
      boneMoving(randomBoneSpeed)
      const bounds1 = this.corgi.getBounds();
      const bounds2 = bone.getBounds();

      const collided = bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;

      if (collided || bone.x < -200) {
        boneFlyoverTween.stop()
        createNewBone()
      }
    })

    const createNewBone = () => {
      randomBoneSpeed = Math.floor(Math.random() * 5) + 3;
      randomBonePosY = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
      boneFlyoverTween =
        new TWEEN.Tween(bone.position).to({y: randomFlyoverPosition}, 1000).easing(TWEEN.Easing.Quadratic.Out)
      randomIndex = Math.floor(Math.random() * boneFlyoverPositions.length);
      randomFlyoverPosition = boneFlyoverPositions[randomIndex]
      bone.y = randomBonePosY;
      bone.x = randomBonePosX
      boneFlyoverTween.start()
    }


    this.jumpTween = new TWEEN.Tween(this.corgi.position).to({y: 320}, 350).easing(TWEEN.Easing.Quadratic.Out);
    this.landTween = new TWEEN.Tween(this.corgi.position).to({y: 400}, 350).easing(TWEEN.Easing.Quadratic.In);
    this.jumpTween.chain(this.landTween);


    const jumping = () => {
      this.corgi.texture = corgiJumpingTexture;
      this.jumpTween.update()
      this.landTween.update()
      this.landTween.onComplete(() => {
        this.jumpTween.stop()
        this.landTween.stop()
        this.ticker.remove(jumping)
        this.corgi.texture = corgiRunningTextureOne;
      })
    }

    const walkingForward = () => {
      this.corgi.x += 1.5;
    }

    const walkingBackward = () => {
      this.corgi.x -= 1.5;
    }

    document.addEventListener('keydown', event => {
      if (event.repeat) {
        return;
      }
      if (event.code === 'Space' && this.jumpTween.isPlaying()) {
        event.preventDefault()
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault()
        this.jumpTween.start()
        this.ticker.add(jumping)
        return;
      }
      if (event.code === 'KeyD') {
        this.ticker.remove(walkingForward)
        this.ticker.add(walkingForward)
        return;
      }
      if (event.code === 'KeyA') {
        this.ticker.remove(walkingBackward)
        this.ticker.add(walkingBackward)
        return;
      }
    })

    document.addEventListener('keyup', event => {
      if (event.repeat) {
        return;
      }
      if (event.code === 'KeyD') {
        this.ticker.remove(walkingForward)
      }
      if (event.code === 'KeyD') {
        this.ticker.remove(walkingForward)
      }
      if (event.code === 'KeyA') {
        this.ticker.remove(walkingBackward)
      }
    })


    setInterval(() => {
      if (this.corgi.texture === corgiRunningTextureOne) {
        this.corgi.texture = corgiRunningTextureTwo
      } else if (this.corgi.texture === corgiRunningTextureTwo) {
        this.corgi.texture = corgiRunningTextureOne
      }
    }, 150)

  }

}
