import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, MarianTokenizer, MarianMTModel


def translate(msg: str, from_lang: str = "ka", to_lang: str = "en", tokenizer: MarianTokenizer = None, model: MarianMTModel = None) -> str:
    supported_language_pairs: list[tuple[str, str]] = [("en", "ka"), ("ka", "en"), ("en", "ru"), ("ru", "en")]
    if (from_lang, to_lang) not in supported_language_pairs:
        return "<unsupported_language>"

    if to_lang == "ka":  # For translation to Georgian, only English to Georgian model exists
        from_lang = "synthetic-en"  # and only that model name contains "synthetic": opus-mt-synthetic-en-ka

    if tokenizer is None:
        tokenizer = AutoTokenizer.from_pretrained(f"Helsinki-NLP/opus-mt-{from_lang}-{to_lang}")
    if model is None:
        model = AutoModelForSeq2SeqLM.from_pretrained(f"Helsinki-NLP/opus-mt-{from_lang}-{to_lang}")

    inputs = tokenizer(msg, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(**inputs)

    translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return translated_text