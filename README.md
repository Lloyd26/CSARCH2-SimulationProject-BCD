# Binary-Coded Decimal Generator and Translator Simulator
A simulator for generating an unpacked, packed, or densely packed binary-coded decimal (BCD) from a decimal, and for translating a densely packed BCD into decimal.

Web App Link: https://bcd-generator-translator.pages.dev/

It supports the following features:
- Decimal to Unpacked BCD
- Decimal to Packed BCD
- Decimal to Densely Packed BCD
- Densely Packed BCD to Decimal

It can also save the output result into a text file.

## Video Demonstration
Video Demo Link: https://youtu.be/jOgvcPeQX1c
[![Video Demonstration](https://img.youtube.com/vi/jOgvcPeQX1c/maxresdefault.jpg)](https://youtu.be/jOgvcPeQX1c)

---

## Test Case 1: Decimal to Unpacked BCD

Converting a decimal into unpacked BCD involves transforming each digit of the decimal into its 8-bit (byte) binary equivalent.

For instance, if the decimal input is `128`, then its unpacked BCD equivalent is `00000001 00000010 00001000`.

| `00000001` | `00000010` | `00001000` |
| ---------- | ---------- | ---------- |
| 1          | 2          | 8          |

![Decimal to Unpacked BCD](docs/images/1%20-%20Decimal%20to%20Unpacked%20BCD.png)

## Test Case 2: Decimal to Packed BCD

Converting a decimal into packed BCD is similar to the process of converting into unpacked BCD. The only difference is that the output contains 4 bits (nibble) per decimal digit. This saves space than unpacked BCD as it removes the unnecessary bits.

In this case, if the decimal input is `128`, then its packed BCD equivalent is `0001 0010 1000`.

| `0001` | `0010` | `1000` |
| ------ | ------ | ------ |
| 1      | 2      | 8      |

![Decimal to Packed BCD](docs/images/2%20-%20Decimal%20to%20Packed%20BCD.png)

## Test Case 3: Decimal to Densely Packed BCD

Converting a decimal into densely packed BCD involves making use of a lookup table to determine the correct BCD representation.

This is even more space-efficient than packed BCD as it will always use 10 bits instead of 12 in the packed BCD.

It is necessary to convert the decimal into packed BCD first before using the lookup table.

Example: Converting decimal input `128` into densely packed BCD

**Input**: `128`

1. Convert into packed BCD.

(Decimal) `128` = (Packed BCD) `0001 0010 1000`.

2. Label each bit from `a` to `m`, skipping `l` to avoid confusion with `1`.

| a | b | c | d | e | f | g | h | i | j | k | m |
| - | - | - | - | - | - | - | - | - | - | - | - | 
| `0` | `0` | `0` | `1` | `0` | `0` | `1` | `0` | `1` | `0` | `0` | `0` |

3. Find the corresponding row on the lookup table based on the values of `a`, `e`, and `i`.

- `a` = `0`
- `e` = `0`
- `i` = `1`

| a | e | i |   | p | q | r | s | t | u | v | w | x | y |
| - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| `0` | `0` | `1` |   | b | c | d | f | g | h | `1` | `0` | `0` | m |

(Note: Table has been truncated to only include the relevant row.)

4. The output bits are labeled from `p` to `y`.

| p | q | r | s | t | u | v | w | x | y |
| - | - | - | - | - | - | - | - | - | - |
| `0` | `0` | `1` | `0` | `1` | `0` | `1` | `0` | `0` | `0` |

**Output**: `0010101000`

![Decimal to Densely Packed BCD](docs/images/3%20-%20Decimal%20to%20Densely%20Packed%20BCD.png)

## Test Case 4: Densely Packed BCD to Decimal

Translating a densely packed BCD back into decimal format also uses the lookup table to determine which pattern is used in encoding into densely packed BCD.

After translating from densely packed BCD, it will need to be converted from packed BCD to decimal.

Example: Converting densely packed BCD input `0010101000` into decimal

**Input**: `0010101000`

1. Label the bits from `p` to `y`.

| p | q | r | s | t | u | v | w | x | y |
| - | - | - | - | - | - | - | - | - | - |
| `0` | `0` | `1` | `0` | `1` | `0` | `1` | `0` | `0` | `0` |

2. In finding the correct row to use on the lookup table, the bit constants (i.e., `0` and `1`) will be used as a reference.

    1. Check the `v` bit. This determines if there are large numbers (i.e., `8` and `9`) in the decimal.
    2. If the `v` bit is `1`, check the `w` and `x` bits. These indicate the position of the large number.
       - `wx` = `10` (left)
       - `wx` = `01` (middle)
       - `wx` = `00` (right)
    3. If the `w` and `x` bits are both equal to `1` (i.e., `wx` = `11`), then check the `s` and `t` bits. These indicate the position of the small number (i.e., `0` to `7`) since there are 2 large number digits in the decimal.
    4. If both `wx` and `st` are equal to `11`, then all the digits in the decimal is a large number digit. Check the `r`, `u`, and `y` bits to determine if the digit is `8` (`1000`) or `9` (`1001`).

| a | e | i |   | p | q | r | s | t | u | v | w | x | y |
| - | - | - | - | - | - | - | - | - | - | - | - | - | - |
| `0` | `0` | `1` |   | b | c | d | f | g | h | `1` | `0` | `0` | m |

(Note: Table has been truncated to only include the relevant row.)

3. The output bits of the densely packed BCD are labeled from `a` to `m`, skipping `l`. If a label bit does not appear on the row, then it is assumed to be equal to `0`.

| a | b | c | d | e | f | g | h | i | j | k | m |
| - | - | - | - | - | - | - | - | - | - | - | - | 
| `0` | `0` | `0` | `1` | `0` | `0` | `1` | `0` | `1` | `0` | `0` | `0` |

4. Convert the packed BCD output into decimal.

    1. Separate the bits by grouping them into 4 bits.
  
    | `0001` | `0010` | `1000` |
    | ------ | ------ | ------ |

    2. Convert each 4 bit group from binary to decimal.

    | `0001` | `0010` | `1000` |
    | ------ | ------ | ------ |
    | 1      | 2      | 8      |

**Output**: 128

![Densely Packed BCD to Decimal](docs/images/4%20-%20Densely%20Packed%20BCD%20to%20Decimal.png)
