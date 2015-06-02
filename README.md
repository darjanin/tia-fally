# FALLY

Simple JS game creted for TIA.

## Goal of game

Goal of game is to survive the fall. You are falling through cloudy sky.
Your speed stays the same, but the distance between clouds is changing.

## Code showcase

```ruby
GRADES = {
  A: 1.0,
  B: 1.5,
  C: 2.0,
  D: 2.5,
  E: 3.0,
  Fx:4.0
}

class Student
  attr_accesor :name

  def initialize(name)
    @name = name
    @grades = {}
  end

  def add_grade(class, grade)
    @grades[class.to_sym] = grade.to_sym
  end

  def average
    return 0.0 if @grades.empty?

    @grades.inject(0) do |total, class, grade|
      total += GRADES[grade]
    end / @grades.size
  end

end
```

The code showcase has nothing to do with this project. But this project repo is private so it's not gonna make problems.

## Tables?

|
