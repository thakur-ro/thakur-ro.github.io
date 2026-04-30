---
title: "Decision Boundaries: A Geometric Lens on ML"
tags: [ml, decision-boundaries, classifiers, geometry, llm-internals]
date: 2026-04-29
---

# Decision Boundaries: A Geometric Lens on ML

Don't study a model's math — study the shape of its fences.

Every classifier divides feature space into regions, one per prediction class. The boundary between regions is the **decision boundary**. Understanding the *shape* of that boundary tells you more about an algorithm's behavior than reading its equations does.

## The Mental Model: Fences in a Field

Each data point is a dot. Each color is a prediction class. The algorithm's job is to draw fences that put each color in its own pasture. You learn what an algorithm is doing by looking at the shape of its fences.

| Algorithm | Fence shape |
|---|---|
| Logistic regression, Linear SVM, LDA, Perceptron | A straight line (hyperplane in high dimensions) |
| Decision tree | Axis-aligned rectangles (LEGO walls running only N-S or E-W) |
| Random forest | Averaged LEGO walls — rectangular where trees agree, jagged elsewhere |
| Naive Bayes (Gaussian, class covariance) | Curved / quadratic |
| Neural network (shallow) | A few smooth curves |
| Neural network (deep) | Arbitrarily complex — a wet noodle that wraps around any shape |

## Linear Is More Powerful Than It Looks

If your data isn't linearly separable in its original space, transform it. Polynomial features, kernel tricks, learned embeddings — all reshape the space so a linear fence works. Most of modern ML's power comes from **"transform, then linearly slice."**

Logistic regression, linear SVM, LDA, perceptron, and a single fully-connected neural layer all draw the same shape of fence. They differ in how they *fit* that fence, not in its geometry.

## Expressivity = Regions × Function Class

A useful way to compare algorithms without doing the math: count how many regions the classifier can produce and ask what kind of function defines each boundary. A 2-region linear classifier cannot represent what a 16-region polynomial classifier can. This is the geometric definition of model capacity.

## Neural Networks Compose Linear Boundaries

A fully-connected layer is logistic regression — it draws a hyperplane. Stack many layers with non-linear activations between them and you compose linear boundaries into flexible non-linear ones. More layers → bumpier fences. TensorFlow Playground makes this viscerally obvious.

## LLMs Draw Linear Boundaries Inside Their Hidden States

This is where the classical ML story connects to modern AI.

A transformer's hidden state is a high-dimensional vector. The projection layers are doing classification in that latent space — drawing hyperplanes that separate "next token = X" from "next token = Y."

More strikingly: **LLMs draw linear boundaries to classify the user.** Harvard research (Viégas, Wattenberg et al., 2024) trained linear probes on LLaMA-2-Chat 13B activations and found the model internally classifies users by:
- Age
- Gender
- Education level
- Socioeconomic status

These live on **linear hyperplanes in the 5,120-dimensional hidden state** — the same mathematics as logistic regression, just in a much larger space.

## Why the User Model Matters

The user model affects the answer. In one documented case, the same chatbot told a user inferred as higher-income that direct flights from Boston to Hawaii were available. It told a user inferred as lower-income that no direct flights existed. Same question. Different inferred user. Different "fact."

This is not a corner case — it's the expected behavior of any model that has built an internal user model and uses it to condition its outputs.

## Inverse Scaling

Bigger models aren't always better on every dimension. Anthropic research found:
- **Sycophancy scales with model size** — larger LMs more reliably repeat back the user's preferred answer
- **RLHF can amplify certain biases** — more RLHF correlates with stronger expressed political views

## Tools for Building Intuition

- [TensorFlow Playground](https://playground.tensorflow.org/) — watch decision boundaries change as you add layers
- [Decision Boundary Playground](https://nlhlong01.github.io/playground/) — classical ML algorithms, tree depth vs. boundary shape

## Related

- [[llm-user-models|LLMs Have Internal User Models]]
- [[retrieval/rag-fundamentals|RAG Fundamentals]]
