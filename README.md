# My 2d platformer

## About
It's a 2d platformer implemented using *pure JavaScript* and *DOM API* (without *Canvas* and special libs).

At the moment this game has the following functionality:
1. The Player's physics
2. Obstacles handling

## Available Scripts
1. `npm run serve` starts DevServer (`http://localhost:3000/`)
2. `npm run build` builds the app for production to the `dist` folder

**Note:** it is necessary to specify `publicPath: '/'` in `webpack.config.js` for the DevServer to work correctly. If you are planning to upload the project to a subdirectory of your site then change this property to `publicPath: './'` when building for production.

## Game engine logic
1. A character sprite is inside a rectangular block element
2. The coordinates of the game elements are calculated relative to the block `game` without taking into account the scrolling of the block (only in the visible area)
3. setInterval inside `index.js` calls the animation of characters and passes the state of motion keys (right, left and up)
4. Each call of the `animate` method checks if a character is on the ground
5. A character has *three* points at the base to check the ground and *eight* points to check obstacles. If a character is on the ground then alignment to the ground level occurs
6. Before moving a character checks for an obstacle at the next coordinate according to its step (vertical or horizontal). If an obstacle is in the path of movement then a character shortens its step in order to get as close as possible to an obstacle
7. The folder `src/shared` contains general functions for working with *dom* elements, coordinates, alignment, obstacle check and ground check. The animation of movements is implemented at the level of character logic (in the folder `src/heroes`)
8. The background of the game is generated from the array (see `src/settings/worldSettings.js`). Each element of the array converted to the `div` element with the corresponding class
9. The block with the game has a fixed size of 1200 x 600 pixels. Also this block has scrolling along both axes

## Links

### The player's sprite is taken from:
https://freepngimg.com/png/83123-computer-sprite-figure-character-fictional-2d-animation
