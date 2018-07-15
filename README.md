# SnapSimplex

This is a tool to resolve linear programming from an image with the simplex method. Ok, so this is a console aplication written in Node.js, for the image recognition I used the [Google Cloud Vision API](https://cloud.google.com/vision/) and the Simplex is calculated using this [simplex-solver](https://www.npmjs.com/package/simplex-solver) npm package.

![but why?](https://media.giphy.com/media/1M9fmo1WAFVK0/giphy.gif)

First let me explain the problem:

  > Linear programming (LP, also called linear optimization) is a method to achieve the best outcome (such as maximum profit or lowest cost) in a mathematical model whose requirements are represented by linear relationships. Linear programming is a special case of mathematical programming (also known as mathematical optimization).

We can solve linear optimization throught diferent methods:

- Try all the alternatives, but that's impossible with almost every existent lp problem;

- Draw a graph and try only the interest points it shows, but that's a lot of work for any regular size problem;

- Linear equation system, now we're talking but still this scales in work as the problem get bigger and more complex;

-  [Fourier–Motzkin elimination](https://en.wikipedia.org/wiki/Fourier%E2%80%93Motzkin_elimination), thank you mr Fourier, this mathematical method is capable of solve any lp, but it still isn't the fastest and simpler way;

-  [Simplex algorith](https://en.wikipedia.org/wiki/Simplex_algorithm), finally with this we can solve any lp as big and complex as one can be.

Now imagine you want to solve several lp's from a book or a slide, basicaly an image, which process will take most of the time? There are several applications that will solve a lp with Simplex (like [Lingo](https://www.lindo.com/index.php/ls-downloads) or [this online calculator](http://simplex.tode.cz/en/)), but typing the problems takes a long time and require atention. So that's why I've spent hours to create this ~~very usefull~~ aplication, and to learn how to use the Google Cloud (mostly this last reason).

## Instalation

Ok, what will you need to run this?

- Go to [Google Cloud Console]() and login;

-  [Enable the Vision API](https://cloud.google.com/vision/docs/before-you-begin);

-  [Create a Service Account](https://cloud.google.com/iam/docs/creating-managing-service-accounts#creating_a_service_account) (I found it easyer to follow the instructions on the *console* tab);

- Remember to enable the `Provide a new private key` option and select JSON format;

- You also need Node.js installed, you can download it [here](https://nodejs.org/en/);

- Now you have to clone the repository (`git clone https://github.com/v-herzog/SnapSimplex.git`) and enter the SnapSimplex folder (`cd SnapSimplex`);

- And last, install the [google cloud vision](https://www.npmjs.com/package/@google-cloud/vision) and the [simplex-solver](https://www.npmjs.com/package/simplex-solver) npm packages:

```node
npm install --save @google-cloud/vision
npm install --save simplex-solver
```

The *simplex-solver package* is limited to maximization problems, so no minimizations yet. 
All Done! Let’s solve some problems with the simplex algorithm:

## Usage

To solve a problem just type `node solve` and the problem's image path:

```node
node solve [image-path]
```

The `example.png` in the images folder is the image I used to test this:

```node
node solve ./images/example.png
```

If you wish to see all the steps the algorithm made type `--step-by-step` after the image path, with this you can see how many iterations it tooked to solve the problem, all the values from the tables it created and the pivot from each step. If you use this for a really big problem be prepared for a very long list.

```node
node solve [image-path] --step-by-step
```

Check it out in action:

![amazing gif](https://github.com/v-herzog/SnapSimplex/blob/master/images/demo.gif)
