#!/bin/sh

rm -rf instrumented
mkdir ../chess-instrumented
jscoverage --no-instrument=jsunit ./ ../chess-instrumented
mv ../chess-instrumented instrumented
