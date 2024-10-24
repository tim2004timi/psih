from .models import Product


def string_id(value: int) -> str:
    value = str(value)
    if len(value) <= 2:
        return value
    return value[-2:]


def create_auto_article(product: Product, size: str) -> str:
    eng_vowels = "aeiouy"
    rus_letters = "йцукенгшщзхъфывапролджэячсмитьбю "
    forbidden_letters = eng_vowels + rus_letters

    article = product.name.lower()
    full_string = "".join([char for char in article if char not in forbidden_letters])
    full_string = "_" if full_string == "" else full_string
    upper_full_string = full_string.upper()
    new_product_id = string_id(product.id)
    result_article = upper_full_string[:6] + f"+{new_product_id}" + f"-{size}"

    return result_article
