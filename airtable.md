# Airtable Formulas

Here are the formulas that I'm using in this Airtable base and I have a few options available for you. 

## Doing the math on the results

You can use this formula and set the response to an integer:

```
AVERAGE({Answer1}, {Answer2}, {Answer3}, {Answer4})
```

You can use the above formula and and then use this formula on the results from above to round it:
```
ROUND({Result})
```

You can call the round calculation on the very first option:
```
ROUND(AVERAGE({Answer1}, {Answer2}, {Answer3}, {Answer4}))
```

## Looking at results and providing the right character

To get the name, we'll use nested IF statements
```
IF(
  {result-calc} = 4, 'Ted',
    IF(
      {result-calc} = 3, 'Roy',
      IF(
        {result-calc} = 2, 'Beard',
          IF(
            {result-calc} = 1, 'Rebecca', 'Out of range'
          )
      )
   )
)
```

To get the description, we'll use nested IF statements
```
IF(
  {result-calc} = 4, 'You’re an optimist and see the positive side of things. You’re forgiving and you never seem to think of yourself, but instead you look to take care of others. You like dad jokes and rhyming. You see a step ahead and you’re playing chess while others play checkers.',
    IF(
      {result-calc} = 3, 'You’re gruff and probably the scariest person you know. You like to win and you rightfully carry a lot of pride. But, underneath you’re a really kind person who cares about others. You’ll ultimately do the right thing, it may just take you a minute to get there.',
      IF(
        {result-calc} = 2, 'You’re someone who doesn’t care for emotion. You love facts and you are a pragmatist. You love to have a good time and you never say no to a party. You’re often the smartest person in the room and you’re the one who drives your friends and family to see reason.',
          IF(
            {result-calc} = 1, 'You’re strong and fiercely independent. You would rather do it yourself then rely on others and you’re never above a little bit of revenge. You wear your emotions on your sleeves and even though others see you as aloof, you’re the best friend most people will ever have.', 'Out of range'
          )
      )
   )
)
```

To get the image, we'll use nested IF statements
```
IF(
  {result-calc} = 4, 'https://assets.website-files.com/6164e3f755b015d7a7334494/6168cbc70ec821f72a41a059_ted.jpg',
    IF(
      {result-calc} = 3, 'https://assets.website-files.com/6164e3f755b015d7a7334494/6168cbc6c20ee33385599652_roy.jpg',
      IF(
        {result-calc} = 2, 'https://assets.website-files.com/6164e3f755b015d7a7334494/6168cbc6be24130fd1193e84_beard.jpg',
          IF(
            {result-calc} = 1, 'https://assets.website-files.com/6164e3f755b015d7a7334494/6168cbc6c7b1671599a34494_rebecca.jpg', 'Out of range'
          )
      )
   )
)
```

## Automation script

If you want to rollup the table and use percentages, you can use this in your automation script. The automation is: 

New row created > run this script to populate a lookup field

```js
let characterResult = input.config();
let match;

if (characterResult.character == "Roy") {
  output.set("match", "recMZaNZf5KNuxOHM");
} else if (characterResult.character == "Ted") {
  output.set("match", "recNG1nASAXU7Uxaq");
} else if (characterResult.character == "Rebecca") {
  output.set("match", "rec7OnzgWQcVt1JLC");
} else if (characterResult.character == "Beard") {
  output.set("match", "recjXYx2JP9odw19T");
}
```