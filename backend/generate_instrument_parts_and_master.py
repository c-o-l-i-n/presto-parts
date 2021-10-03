import sys
import os
import PyPDF2

if __name__ == "__main__":
	# read cmd line args
	pieces = []
	for i in range(1, len(sys.argv) - 2):
		pieces.append(sys.argv[i])
	parts_list_path = sys.argv[-2]
	dest_name = sys.argv[-1]

	# create list of parts and number of respective copies
	num_copies_of_part = dict()
	with open(parts_list_path) as parts_list_file:
		for line in parts_list_file:
			# split line into part name and number of copies
			part_name_and_num_copies = line.split("#")

			# remove spaces from part name
			part_name_and_num_copies[0] = part_name_and_num_copies[0].strip() \
				.replace(" ", "")

			# set default num copies to 1 or convert num copies from str to int
			if len(part_name_and_num_copies) < 2:
				part_name_and_num_copies.append(1)
			else:
				part_name_and_num_copies[1] = int(part_name_and_num_copies[1])

			# add part and its number of pages to dict
			num_copies_of_part[part_name_and_num_copies[0]] \
				= part_name_and_num_copies[1]

	# create new dir named dest_name and chdir to that dir
	os.mkdir(dest_name)
	os.chdir(dest_name)

	# create PDF for each instrument
	master_writer = PyPDF2.PdfFileWriter()
	master_file_name = "{}-MASTER.pdf".format(dest_name)
	for part in num_copies_of_part.keys():
		part_file_name = "{}-{}.pdf".format(dest_name, part)
		part_writer = PyPDF2.PdfFileWriter()

		# merge parts from each piece
		for piece in pieces:
			os.chdir("../{}".format(piece))
			# open part_files (yes, it has to be done this way...)
			part_files = []
			part_files.append(open("{}-{}.pdf".format(piece, part), "rb"))
			part_file_reader = PyPDF2.PdfFileReader(part_files[-1])
			part_writer.appendPagesFromReader(part_file_reader)

			# if working with a score, special case, add a blank page after each
			if part.upper() == "SCORE" and part_file_reader.numPages %2 == 1:
				part_writer.addBlankPage()

		# export part PDF
		os.chdir("../{}".format(dest_name))
		with open(part_file_name, "wb") as part_pdf_writer:
			part_writer.write(part_pdf_writer)

		# open part_pdf_readers (yes, it has to be done this way...)
		part_pdf_readers = []
		part_pdf_readers.append(open(part_file_name, "rb"))
		# append part PDF to master PDF
		part_file_reader = PyPDF2.PdfFileReader(part_pdf_readers[-1])
		for i in range(0, num_copies_of_part[part]):
			master_writer.appendPagesFromReader(part_file_reader)
			# if odd number of pages, add blank page for double sided printing
			if part_file_reader.numPages %2 == 1:
				master_writer.addBlankPage()

	# export master PDF
	with open(master_file_name, "wb") as master_file:
		master_writer.write(master_file)

	# close part_pdf_readers (yes, it has to be done this way...)
	for i in range(len(part_pdf_readers)):
		part_pdf_readers[i].close()

	# close part_files (yes, it has to be done this way...)
	for i in range(len(part_files)):
		part_files[i].close()
