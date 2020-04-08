pushd deck.gl/bindings/pydeck/docs
rm -fr _build
make markdown
popd

rm -fr docs/generated-markdown
mv deck.gl/bindings/pydeck/docs/_build/markdown docs/generated-markdown
